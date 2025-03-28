import axios, { isAxiosError } from "axios";
import { CodeResponse } from "@react-oauth/google";
import Cookies from "js-cookie";

import {
  BasicUser,
  DetailedUser,
  LoopInfoJson,
  LoopJson,
  PagedLoops,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define types for request and response data
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ApiResponse {
  message: string;
}

export interface LoginResponse {
  user_id: number;
  message: string;
}

export const emailLogin = async (
  credentials: LoginRequest,
): Promise<ApiResponse> => {
  try {
    const res = await apiClient.post<LoginResponse>("/login", credentials);

    // TODO: remove me when backend is done!
    Cookies.set("userId", res.data.user_id.toString());

    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.get<ApiResponse>("/signout");

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "sign out failed" };
  }
};

export const emailSignUp = async (
  userData: SignUpRequest,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/signup", userData);

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

export const verify = async (credentials: CodeResponse) => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/oauth/google",
      credentials,
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "third party login failed" };
  }
};

export const healthCheck = async () => {
  try {
    const response = await apiClient.get<ApiResponse>("/health");

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "health check failed" };
  }
};

export const getLoopById = async (id: number) => {
  try {
    const { data } = await apiClient.get<LoopInfoJson>(`/loops/${id}`);

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export const getLoops = async (
  page: number,
  sortBy: string = "createdAt",
  order: string = "desc",
) => {
  try {
    const { data } = await apiClient.get<PagedLoops>(
      `/loops?page=${page}&sortBy=${sortBy}&order=${order}`,
    );

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export const getLoopsByUserId = async (page: number, userId: number) => {
  try {
    const { data } = await apiClient.get<PagedLoops>(
      `/loops?page=${page}&userId=${userId}`,
    );

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export const getUserById = async (id: number) => {
  try {
    const { data } = await apiClient.get<BasicUser>(`/users/${id}`);

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export const getDetailedUserById = async (id: number) => {
  try {
    const { data } = await apiClient.get<DetailedUser>(
      `/users/${id}?type=detailed`,
    );

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export interface CreateLoopRequest {
  loop: LoopJson;
  bpm: number;
  title: string;
}

export const createLoop = async (loopData: CreateLoopRequest) => {
  try {
    const { data } = await apiClient.post<LoopInfoJson>(`/loops`, loopData);

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export interface UpdateLoopRequest extends CreateLoopRequest {}

export const updateLoopById = async (
  id: number,
  loopData: UpdateLoopRequest,
) => {
  try {
    const { data } = await apiClient.put<LoopInfoJson>(
      `/loops/${id}`,
      loopData,
    );

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export const createRating = async (loopId: number, rating: number) => {
  try {
    const { data } = await apiClient.post<LoopInfoJson>(
      `/loops/rate/${loopId}`,
      { rating },
    );

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export interface Rating {
  rating: number | null;
}

export const getRating = async (loopId: number) => {
  try {
    const { data } = await apiClient.get<Rating>(`/loops/rate/${loopId}`);

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

export const updateRating = async (loopId: number, rating: number) => {
  try {
    const { data } = await apiClient.put<LoopInfoJson>(
      `/loops/rate/${loopId}`,
      { rating },
    );

    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err.message;
    }
    throw `Unexpected error: ${err}`;
  }
};

// Fetch and set CSRF token
const fetchCsrfToken = async () => {
  const response = await apiClient.get("/csrf-token");
  const csrfToken = response.headers["x-csrf-token"];
  if (csrfToken) {
    apiClient.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    console.log("CSRF token set up")
  }
};

// Initialize CSRF token once on app load
fetchCsrfToken().catch(console.error);