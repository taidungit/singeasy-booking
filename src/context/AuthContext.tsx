import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import axiosClient from "@/services/axiosClient"; 
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "RESTORE_USER"; payload: User }
  | { type: "AUTH_READY" }
  | { type: "UPDATE_USER"; payload: User }; 

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: true, error: null };
    case "RESTORE_USER":
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: true };
    case "AUTH_READY":
      return { ...state, isLoading: false };
    case "AUTH_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      return { user: null, isAuthenticated: false, isLoading: false, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "UPDATE_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { 
        ...state, 
        user: action.payload 
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Automatically restore user session on browser refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "RESTORE_USER", payload: user });
      } catch (error) {
        localStorage.removeItem("user");
        dispatch({ type: "AUTH_READY" });
      }
    } else {
      dispatch({ type: "AUTH_READY" });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await axiosClient.post("/auth/login", {
        username: email, 
        password: password
      });

      const { access_token, user } = response.data;
      const userWithAvatar: User = {
        ...user,
        avatar: user.avatar || undefined
      };

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(userWithAvatar));

      dispatch({ type: "LOGIN_SUCCESS", payload: userWithAvatar });
    } catch (error) {
      let msg = "Wrong email or password. Please try again.";

      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      dispatch({ type: "AUTH_FAILURE", payload: msg });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "AUTH_START" });
    try {
      await axiosClient.post("/auth/register", {
        name,
        email,
        password
      });

      dispatch({ type: "AUTH_READY" });
    } catch (error: unknown) {
      let msg = "Failed to register. Please try again.";

      if (axios.isAxiosError(error)) {
        // Fallbacks through possible Spring Boot error response mappings
        msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : msg);
      } else if (error instanceof Error) {
        msg = error.message;
      }

      dispatch({ type: "AUTH_FAILURE", payload: msg });
      
      // Bubble the error outward so the Register form catch block processes it
      throw new Error(msg);
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });
  const updateUser = (updatedUser: User) => dispatch({ type: "UPDATE_USER", payload: updatedUser });

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};