import axios from "axios"
import appConfig from "./app.config"

export const publicAxios = axios.create({
  baseURL: appConfig.base_url!,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
})
console.log("base_url:", appConfig.base_url)
console.log("BASE URL:", publicAxios.defaults.baseURL)
console.log("HEADERS:", publicAxios.defaults.headers)
export default publicAxios