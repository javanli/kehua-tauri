export const appVersion = '1.9.9';
export const clientType = 'native';
export const systemType = 'iPhone';
export const deviceType = 'iPhone 11';
export const channel = 'App Store';
export const countryCode = '86';
export const UserPublicKeyRSA =
  '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAroRmoOvdaxbai4CFQmh9T54598EfUKqZe93IVW80z6OrH4CEddllaRQ46lHv5ga/I1syL/MGTLi5t5zIrgqExg18nHSPbNcIFrMkYuvdZ1qTBjrAxQrL4cQ+iW38uFXvgz+el01epnmqjZk75EUMjqit4imImBlUoUSUERnQsV22rogzTkXO7/7sxlcOb6/G2n/X4VoMoYQQpsPhTZiz+MERA1/s1U0IHi51gN7WVpm7EhSM338uyIJkjhCACXTn/V67VkVf9bCk2r4tGMerX8awGc9TH+36ctDZbCIQlkzJPn+P73CNi0/Z2FCS0FJh2iMGwqJkhCfTSfLoHNoxRwIDAQAB-----END PUBLIC KEY-----';
export const RongAPPKey = '4z3hlwrv45dyt';

export const getCommonAdditionHeaders = () => {
  return {
    'User-Agent': 'ke hua/1.9.9 (iPhone; iOS 16.0; AppStore)',
    Authorization: localStorage.getItem('Authorization') ?? '',
  };
};

export const logFactory = (TAG: string) => {
  return (content: any) => {
    console.log(TAG, content);
  };
};
