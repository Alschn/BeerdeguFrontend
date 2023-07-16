import axios, { type AxiosRequestConfig } from "axios";
import { env } from "~/env.mjs";

const axiosLocalConfig: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json" },
  baseURL: "",
};

// Client that is used to make direct requests to the Next.js API routes
export const axiosClient = axios.create(axiosLocalConfig);

const axiosPublicConfig: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json" },
  baseURL: env.NEXT_PUBLIC_API_URL,
};

// Client that is used to make direct requests to the API
export const axiosPublicClient = axios.create(axiosPublicConfig);

const axiosGatewayConfig: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json" },
  baseURL: "/api/gateway",
  withCredentials: true,
};

// Client that sends requests to Next.js API route, which proxies requests to the API
export const axiosGatewayClient = axios.create(axiosGatewayConfig);
