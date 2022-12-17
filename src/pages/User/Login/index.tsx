import Footer from '@/components/Footer';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  // ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel, useRequest } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import styles from './index.less';
import initGeetest from '../../../gt.0.4.9';
import { getGeetestRegister } from '@/services/kehua/geetest';
import { getAccountSms, postAccountLogin } from '@/services/kehua/login';
import {
  appVersion,
  channel,
  clientType,
  countryCode,
  deviceType,
  systemType,
  UserPublicKeyRSA,
} from '@/utils';
import JSEncrypt from 'jsencrypt';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [status, setStatus] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const updateState = await initialState?.fetchInitialState?.();
    if (updateState) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          ...updateState,
        }));
      });
    }
  };
  const [captchaObj, setCaptchaObj] = useState<any>(null);
  const [captchaReady, setCaptchaReady] = useState<boolean>(false);
  useRequest(() => {
    return getGeetestRegister({
      clientType,
      captchaType: 0,
    }).then((result: API.GeeTestRegisterResult) => {
      console.log(result);
      initGeetest(
        {
          ...result.data,
          product: 'bind',
        },
        (captchaObjItem: any) => {
          captchaObjItem.onReady(() => {
            setCaptchaReady(true);
          });
          setCaptchaObj(captchaObjItem);
        },
      );
    });
  });

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const { mobile, code } = values;
      const loginResult = await postAccountLogin(
        {
          mobile,
          deviceId: '4106AC88-C2F0-42F9-A881-47A7CBAFF0AB',
          appVersion,
          systemType,
          code,
          deviceType,
          clientType,
          countryCode,
          channel,
          systemVersion: '16.0',
          installTime: '1670033184',
        },
        {
          skipErrorHandler: true,
        },
      );
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(UserPublicKeyRSA);
      const encryptToken = encryptor.encrypt(loginResult.token ?? '');
      localStorage.setItem('Authorization', `Bearer ${encryptToken}`);
      await fetchUserInfo();
      history.push('/home');
      setStatus('success');
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
      setStatus('error');
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo-nobg.png" />}
          title="可话"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={'mobile'}
            centered
            items={[
              {
                key: 'mobile',
                label: intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                }),
              },
            ]}
          />

          {status === 'error' && <LoginMessage content="验证码错误" />}
          {
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="code"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                phoneName="mobile"
                onGetCaptcha={async (phone) => {
                  console.log(`phone:${phone}`);
                  if (!captchaReady) {
                    return;
                  }
                  try {
                    await new Promise((resolve, reject) => {
                      captchaObj.verify();
                      captchaObj
                        .onSuccess(function () {
                          //your code
                          resolve(null);
                        })
                        .onError(function () {
                          //your code
                          reject(null);
                        });
                    });
                    const result = captchaObj.getValidate();
                    await getAccountSms({
                      challenge: result.geetest_challenge,
                      /** clientType */
                      clientType,
                      countryCode: 86,
                      mobile: phone,
                      seccode: result.geetest_seccode,
                      type: 0,
                      validate: result.geetest_validate,
                    });
                    message.success('获取验证码成功！');
                  } catch (error) {
                    console.log(error);
                  }
                }}
              />
            </>
          }
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
