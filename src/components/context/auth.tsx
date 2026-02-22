"use client";
import { type ReactNode, createContext, useContext } from "react";
import { decode, type JwtPayload } from "jsonwebtoken";

interface User {
  id: number;
  username: string;
  email: string;
}

interface JWTPayload {
  token_type: "access";
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
  token: string | undefined;
}

const decodeAccessToken = (token: string | undefined) => {
  if (!token) return null;
  return decode(token) as JWTPayload;
};

const payloadToUser = (payload: JWTPayload) => {
  return {
    id: payload.user_id,
    username: payload.username,
    email: payload.email,
  };
};

export default function AuthProvider({ children, token }: AuthProviderProps) {
  const decodedToken = decodeAccessToken(token);
  const user = decodedToken ? payloadToUser(decodedToken) : null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
