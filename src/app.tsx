import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { getAppConfig, getMakerAppVersionLatest } from './services/kehua/global';
import { getAccountData } from './services/kehua/user';
import { getImMessageCommentTimeline } from './services/kehuaV2/comment';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
interface InitialUserState {
  currentUser?: API.MyInfo;
  appConfig?: API.ConfigResponse;
  appVersionState?: API.AppVersionResponse;
  comments?: API.Comment[]
}
interface InitialState extends InitialUserState {
  settings?: Partial<LayoutSettings>;
  loading?: boolean;
  fetchInitialState?: () => Promise<InitialUserState | undefined>;
}
export async function getInitialState(): Promise<InitialState> {
  const fetchInitialState = async () => {
    const authorization = localStorage.getItem("Authorization")
    if (authorization === undefined || authorization === null) {
      history.push(loginPath)
      return undefined
    }
    try {
      const currentUserPromise = getAccountData({
        skipErrorHandler: true,
      });
      const appConfigPromise = getAppConfig();
      const appVersionStatePromise = getMakerAppVersionLatest();

      const currentUser = await currentUserPromise;
      const appConfig = await appConfigPromise;
      const appVersionState = await appVersionStatePromise;
      let comments: API.Comment[] = []
      const now = new Date().getMilliseconds()
      let timeStamp = now - 24 * 60 * 60 * 1000;
      while (true) {
        const resp = await getImMessageCommentTimeline({timeStamp})
        if ((resp?.data?.length ?? 0) === 0) {
          break;
        }
        const list = resp.data!
        timeStamp = (list[list.length - 1].timestamp ?? now) + 1
        comments = comments.concat(list)
      }
      return {
        currentUser,
        appConfig,
        appVersionState,
        comments
      };
    } catch (error) {
      localStorage.removeItem("Authorization")
      history.push(loginPath);
    }
    return undefined;
  };
  // 当前在欢迎页
  const state = await fetchInitialState();
  history.push('/home');
  return {
    ...state,
    fetchInitialState,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    waterMarkProps: {
      content: initialState?.currentUser?.nickname,
    },
    menu: {
      request: async () => {
        return [{ name: "主页", path:"/" }]
      }
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      const path = props.location?.pathname ?? "/"
      const hideDrawer = path.includes('/login') || path.includes('/welcome') || path === "/"
      console.log(`showDrawer:${!hideDrawer} path:${path}`)
      return (
        <>
          {children}
          {!hideDrawer && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
  adapter: axiosTauriApiAdapter
};
