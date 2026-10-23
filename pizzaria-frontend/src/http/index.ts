import axios, { type AxiosInstance } from "axios";

declare module "axios" {
     export interface AxiosRequestConfig {
          semAuth?: boolean;
     }
}

function criarHttpClient(baseURL: string): AxiosInstance {
     const client = axios.create({ baseURL });

     client.interceptors.request.use((config) => {
          if (config.semAuth) return config;

          const token = localStorage.getItem("token");
          if (token) {
               config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
     });

     return client;
}

export const httpClient = criarHttpClient("http://localhost:8081");
export const httpClientUsuario = criarHttpClient("http://localhost:8080");