import axios, { AxiosError } from "axios"
import appConfig from "./app.config"
import { getAccessToken } from "../storage/authStorage"

export const axiosClient = axios.create({
  baseURL: appConfig.base_url as string,
  timeout: 100000,
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
        config.headers.Authorization = token
      }

    } catch (error) {
      console.log("TOKEN LOAD ERROR:", error)
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

    const formattedError = {
      status: "error",
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "Something went wrong",
      data: error.response?.data,
      statusCode: error.response?.status,
    }

    console.log("API ERROR:", formattedError)

    return Promise.reject(formattedError)
  }
)

console.log("BASE URL:", appConfig.base_url)

export default axiosClient

// // shared/config/axios.config.ts
// import axios, { AxiosError } from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import appConfig from './app.config';

// const TOKEN_KEY = '@auth_tokens';

// export const axiosClient = axios.create({
//     baseURL: appConfig.base_url as string,
//     timeout: 100000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Request interceptor - Add auth token
// axiosClient.interceptors.request.use(
//     async (config) => {
//         try {
//             // Get token from storage
//             const tokensJson = await AsyncStorage.getItem(TOKEN_KEY);
//             console.log('tokensJson:', tokensJson)

//             if (tokensJson) {
//                 const tokens = JSON.parse(tokensJson);
//                 if (tokens.accessToken) {
//                     config.headers.Authorization = `Bearer ${tokens.accessToken}`;
//                 }
//             }
//         } catch (error) {
//             console.error('Error loading token:', error);
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor - Handle token refresh and errors
// axiosClient.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//         // const originalRequest = error.config as any;

//         // If 401 Unauthorized and haven't retried yet, try to refresh token
//         // if (error.response?.status === 401 && !originalRequest._retry) {
//         //     originalRequest._retry = true;

//         //     try {
//         //         const tokensJson = await AsyncStorage.getItem(TOKEN_KEY);

//         //         if (tokensJson) {
//         //             const tokens = JSON.parse(tokensJson);

//         //             // Attempt to refresh token
//         //             const response = await axios.post(
//         //                 `${appConfig.base_url}/${REFRESH_TOKEN}`,
//         //                 {
//         //                     refresh_token: tokens.refreshToken,
//         //                 }
//         //             );
//         //             console.log('refresh token:', response)

//         //             if (response.data.status === 'success') {
//         //                 // Save new tokens
//         //                 const newTokens = {
//         //                     accessToken: response.data.access_token,
//         //                     refreshToken: response.data.refresh_token,
//         //                 };

//         //                 await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));

//         //                 // Update the failed request with new token
//         //                 originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

//         //                 // Retry the original request
//         //                 return axiosClient(originalRequest);
//         //             }
//         //         }
//         //     } catch (refreshError) {
//         //         // Token refresh failed - clear storage
//         //         console.error('Token refresh failed:', refreshError);
//         //         await AsyncStorage.multiRemove([TOKEN_KEY, '@user_data']);

//         //         // You might want to trigger navigation to login screen here
//         //         // Example: navigationRef.current?.reset({ index: 0, routes: [{ name: 'Auth' }] });
//         //     }
//         // }

//         // Format error response
//         const formattedError = {
//             status: 'error',
//             message:
//                 (error.response?.data as any)?.message ||
//                 error.message ||
//                 'Something went wrong',
//             data: error.response?.data,
//             statusCode: error.response?.status,
//         };

//         return Promise.reject(formattedError);
//     }
// );

// console.log('BASE URL:', appConfig.base_url!);

// export default axiosClient;