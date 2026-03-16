import { createContext, useContext, useReducer, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: true, error: null };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
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
    isLoading: false,
    error: null,
  });

  const login = async (email: string, _password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // Mock API call
      await new Promise((res) => setTimeout(res, 800));
      if (email === "demo@echo.com" && _password === "password") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { id: "1", name: "Alex Chen", email, avatar: undefined },
        });
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: "Invalid email or password." });
      }
    } catch {
      dispatch({ type: "LOGIN_FAILURE", payload: "Something went wrong." });
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await new Promise((res) => setTimeout(res, 800));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { id: Date.now().toString(), name, email },
      });
    } catch {
      dispatch({ type: "LOGIN_FAILURE", payload: "Registration failed." });
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
