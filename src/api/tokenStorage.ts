const ACCESS_TOKEN_KEY = "odin_access_token";
const REFRESH_TOKEN_KEY = "odin_refresh_token";

const canUseStorage = () => typeof window !== "undefined";

export const getAccessToken = () => {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setStoredTokens = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => {
  if (!canUseStorage()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearStoredTokens = () => {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};
