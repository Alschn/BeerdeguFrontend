import {
  axiosClient as axiosLocalClient,
  axiosGatewayClient,
  axiosPublicClient,
} from "./AxiosClient";

export interface LoginPayload {
  username: string;
  password: string;
}

export const login = (payload: LoginPayload) => {
  return axiosLocalClient.post<Record<string, never>>(
    `/api/auth/login/`,
    payload
  );
};

export type EmailResetPayload = {
  email: string;
};

export const resetPassword = (payload: EmailResetPayload) => {
  return axiosPublicClient.post<unknown>(`/api/auth/password/reset/`, payload);
};

export type ConfirmResetPasswordPayload = {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
};

export const confirmResetPassword = (payload: ConfirmResetPasswordPayload) => {
  const { uid, token, new_password1, new_password2 } = payload;
  return axiosGatewayClient.post(
    `/api/auth/password/reset/confirm/${uid}/${token}/`,
    {
      new_password1,
      new_password2,
      uid,
      token,
    }
  );
};

export interface RegisterPayload {
  email: string;
  username: string;
  password1: string;
  password2: string;
}

export const register = (payload: RegisterPayload) => {
  return axiosPublicClient.post<unknown>(`/api/auth/register/`, payload);
};

export const getGoogleAuthUrl = () => {
  return axiosPublicClient.get<{ url: string }>(
    `/api/auth/providers/google/url/`
  );
};

export type GoogleLoginPayload = {
  code: string;
};

export const googleLogin = (data: GoogleLoginPayload) => {
  return axiosLocalClient.post<unknown>(`/api/auth/providers/google/`, data);
};

export const logout = () => {
  return axiosLocalClient.post<Record<string, never>>("/api/auth/logout");
};

export interface ChangePasswordPayload {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export const changePassword = (payload: ChangePasswordPayload) => {
  return axiosGatewayClient.post<unknown>(
    "/api/auth/password/change/",
    payload
  );
};
