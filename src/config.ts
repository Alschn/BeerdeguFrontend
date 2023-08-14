export const ACCESS_TOKEN_KEY = "access";
export const REFRESH_TOKEN_KEY = "refresh";

export const accessCookieConfig = {
  httpOnly: true,
  maxAge: 2 * 60 * 60,
};
export const refreshCookieConfig = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60,
};

export const MIN_ROOM_SLOTS = 1;
export const MAX_ROOM_SLOTS = 10;
