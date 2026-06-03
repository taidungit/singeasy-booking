import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import axiosClient from "@/services/axiosClient"; 
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Khớp chuẩn trường dữ liệu chuỗi Base64
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

  // TỰ ĐỘNG KHÔI PHỤC USER KHI LOAD LẠI TRANG (F5)
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

      // 💥 LƯU Ý: Đảm bảo Backend JSON trả về có chứa trường user.avatar
      const { access_token, user } = response.data;

      // 🟢 PHÒNG THỦ: Nếu Backend lỡ quên không map avatar vào API Login, 
      // ta thử bốc từ DB trả về qua thuộc tính avatar/hoặc fallback để tránh đè mất ảnh cũ.
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
      
      // ✅ ĐÃ XOÁ LỆNH ALERT XẤU XÍ CỦA TRÌNH DUYỆT Ở ĐÂY
      
    } catch (error: unknown) {
      let msg = "Failed to register. Please try again.";

      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      dispatch({ type: "AUTH_FAILURE", payload: msg });
      
      // Bắn ngược lỗi ra ngoài để khối try-catch trong Register.tsx bắt được và không chuyển trang bậy
      throw new Error(msg);
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });
  
  const updateUser = (updatedUser: User) => {
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

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