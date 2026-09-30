import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/constants'

/**
 * Central Axios instance.
 *
 * - `withCredentials: true` so the HTTP-only refresh-token cookie is sent.
 * - The short-lived access token lives in memory (set via setAccessToken)
 *   and is attached to every request — it is never persisted to
 *   localStorage/sessionStorage to reduce XSS blast radius.
 * - On a 401, we attempt a single silent refresh and replay the original
 *   request; if the refresh also fails, we let the error propagate so
 *   AuthContext can log the user out.
 */

let accessToken: string | null = null
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Do NOT attempt token refresh on authentication endpoints or refresh itself
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          } else {
            reject(error)
          }
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await apiClient.post('/auth/refresh')
      const newToken = data?.data?.accessToken ?? null
      setAccessToken(newToken)
      pendingQueue.forEach((resolve) => resolve(newToken))
      pendingQueue = []
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
      return Promise.reject(error)
    } catch {
      pendingQueue.forEach((resolve) => resolve(null))
      pendingQueue = []
      setAccessToken(null)
      // Reject with the ORIGINAL error so the caller sees the true reason (e.g. Invalid email/password)
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)
