import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import axios from "axios";

// Cấu hình axios client (có thể tách ra file riêng src/api/axios.ts)
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

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
    case "UPDATE_USER": // 🌟 THÊM CASE NÀY
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

  // TỰ ĐỘNG KHÔI PHỤC USER KHI LOAD LẠI TRANG
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
      // Gửi đúng request tới AuthController của Backend
      const response = await api.post("/auth/login", {
        username: email, // Backend của bạn dùng LoginDTO có trường username
        password: password
      });

      const { access_token, user } = response.data;

      // Lưu token để các request sau dùng (như Postman)
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      const msg = error.response?.data?.message || "Sai email hoặc mật khẩu!";
      dispatch({ type: "AUTH_FAILURE", payload: msg });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "AUTH_START" });
    try {
      // Gửi request tới /auth/register
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      // Đăng ký xong có thể chuyển người dùng sang trang Login
      // Hoặc tự động gọi hàm login() ở trên nếu muốn vào luôn
      dispatch({ type: "AUTH_READY" });
      alert("Đăng ký thành công! Hãy đăng nhập.");
    } catch (error) {
      // Bắt lỗi "Email đã tồn tại" từ IdInvalidException của Backend
      const msg = error.response?.data?.message || "Đăng ký thất bại.";
      dispatch({ type: "AUTH_FAILURE", payload: msg });
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