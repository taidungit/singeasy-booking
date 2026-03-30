import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "RESTORE_USER"; payload: User }
  | { type: "AUTH_READY" }; // Action mới để báo hệ thống đã kiểm tra xong

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: true, error: null };
    case "RESTORE_USER":
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: true };
    case "AUTH_READY":
      return { ...state, isLoading: false }; // Tắt loading khi không có user trong storage
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { user: null, isAuthenticated: false, isLoading: false, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Bắt đầu là true để kiểm tra localStorage
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
      // Nếu không có user, phải chuyển isLoading sang false để hiện form login
      dispatch({ type: "AUTH_READY" }); 
    }
  }, []);

  const login = async (email: string, _password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await new Promise((res) => setTimeout(res, 800));

      if (email === "admin@gmail.com" && _password === "123456") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { id: "admin-1", name: "Quản trị viên", email, role: "admin" },
        });
      } 
      else if (email === "demo@echo.com" && _password === "password") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { id: "user-1", name: "Alex Chen", email, role: "user" },
        });
      } 
      else {
        dispatch({ type: "LOGIN_FAILURE", payload: "Sai email hoặc mật khẩu!" });
      }
    } catch {
      dispatch({ type: "LOGIN_FAILURE", payload: "Đã xảy ra lỗi hệ thống." });
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await new Promise((res) => setTimeout(res, 800));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { id: Date.now().toString(), name, email, role: "user" },
      });
    } catch {
      dispatch({ type: "LOGIN_FAILURE", payload: "Đăng ký thất bại." });
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};