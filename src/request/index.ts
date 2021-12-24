import axios, { AxiosResponse } from "axios";

const request = axios.create()

request.interceptors.response.use((response: AxiosResponse) => {
  return response.data
})

export default request
