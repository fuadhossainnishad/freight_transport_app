import { logger } from '../utils/logger'
import axios, { AxiosError } from "axios"
import appConfig from "./app.config"
import { getAccessToken } from "../storage/authStorage"
import { logout as clearAuthStorage } from "../utils/auth"

export const axiosClient = axios.create({
  baseURL: appConfig.base_url as string,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
})

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken()

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `${token}`
      }
    } catch (error) {
      logger.error("TOKEN LOAD ERROR:", error)
    }

    return config
  },
  (error) => Promise.reject(error)
)

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status

    // Clear auth state on 401 — token is expired or invalid
    if (status === 401) {
      clearAuthStorage().catch(() => {})
    }

    const message =
      status === 413
        ? "The files you're uploading are too large. Please choose smaller images and try again."
        : (error.response?.data as any)?.message ||
          error.message ||
          "Something went wrong"

    const formattedError = {
      status: "error",
      message,
      data: error.response?.data,
      statusCode: status,
    }

    logger.warn("API ERROR:", formattedError)

    return Promise.reject(formattedError)
  }
)

export default axiosClient

