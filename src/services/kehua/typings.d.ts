declare namespace API {
  type AppVersionResponse = {
    uCloudPublicStoreUrl?: string;
    uCloudPrivateStoreUrl?: string;
    uCloudThumbnail?: string;
    uCloudImagePath?: string;
    uCloudChatPath?: string;
    uCloudAudioPath?: string;
    publicUploadDomain?: string;
    privateUploadDomain?: string;
    domesticDnsUdp?: string;
    foreignDnsUdp?: string;
    domesticDnsDoh?: string;
    foreignDnsDoh?: string;
    availableBuckets?: { uploadRegion?: string; uploadDomain?: string }[];
    videoPath?: string;
    videoCoverImagePath?: string;
    trustedDomains?: string[];
  };

  type ConfigResponse = {
    uCloudPublicStoreUrl?: string;
    uCloudPrivateStoreUrl?: string;
    uCloudThumbnail?: string;
    uCloudImagePath?: string;
    uCloudChatPath?: string;
    uCloudAudioPath?: string;
    publicUploadDomain?: string;
    privateUploadDomain?: string;
    domesticDnsUdp?: string;
    foreignDnsUdp?: string;
    domesticDnsDoh?: string;
    foreignDnsDoh?: string;
    availableBuckets?: { uploadRegion?: string; uploadDomain?: string }[];
    videoPath?: string;
    videoCoverImagePath?: string;
    trustedDomains?: string[];
  };

  type Friend = {
    buildFriendTime?: number[];
    userId?: string;
    nickname?: string;
    avatarName?: string;
    status?: string;
    buildFriendTimeStamp?: number;
  };

  type FriendsRsp = {
    data?: Friend[];
  };

  type GeeTestRegisterResult = {
    status?: number;
    data?: { success?: number; gt?: string; challenge?: string; new_captcha?: boolean };
    msg?: string;
  };

  type getAccountSmsParams = {
    /** challenge */
    challenge: string;
    /** clientType */
    clientType: string;
    countryCode: number;
    mobile: string;
    seccode: string;
    type: number;
    validate: string;
  };

  type getGeetestRegisterParams = {
    /** client type */
    clientType: string;
    captchaType: number;
  };

  type getUploadAuthParams = {
    authKey: string;
    md5Content: string;
    saveKey: string;
    uploadType: string;
  };

  type LoginRequest = {
    mobile?: string;
    deviceId?: string;
    appVersion?: string;
    systemType?: string;
    code?: string;
    deviceType?: string;
    clientType?: string;
    countryCode?: string;
    channel?: string;
    systemVersion?: string;
    installTime?: string;
  };

  type LoginResult = {
    userId?: string;
    token?: string;
    signUp?: string;
    testGroup?: string;
  };

  type MyInfo = {
    mobile?: string;
    birthday?: string;
    avatarName?: string;
    backgroundImages?: string[];
    nickname?: string;
    country?: string;
    province?: string;
    sex?: string;
    city?: string;
    nicknameUpdateTime?: string;
    userId?: string;
    auditing?: { nickname?: string; avatarName?: string; backgroundImages?: any[] };
    defaultBackground?: string;
    viewableByStranger?: string;
    testGroup?: string;
    status?: string;
    riskState?: string;
    countsOfActivities?: number;
    cancellationTime?: number;
    registerTime?: string;
    recommendState?: string;
    pushState?: string;
    ipLocation?: string;
    mutePenalizeEndTimestamp?: number;
  };
}
