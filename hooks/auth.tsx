import { auth } from "@firebase";
import React, { createContext, useCallback, useContext, useState } from "react";
import isEqual from "react-fast-compare";
import api from "services/api";

interface User {
  email: string;
  name: string;
  uid: string;
  projects: string[];
  phone: string;
  type: string;
  stripe: {
    client: string;
    uid: string;
  };
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
  validateUserToken(): Promise<void>;
}

const initialAuthData: AuthContextData = undefined;
const AuthContext = createContext<AuthContextData | undefined>(initialAuthData);

export const AuthProvider: React.FC = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | undefined>(() => {
    let userData: string;

    if (typeof window !== "undefined") {
      userData = localStorage.getItem("@MestreDeObra:user");
    }

    if (userData) {
      const parsedUser: User = JSON.parse(userData);
      return { ...parsedUser };
    }

    return undefined;
  });

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    try {
      const authenticadedUser = await auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const userResponse = await api.get("/firestore/user", {
        params: { uid: authenticadedUser.user.uid },
      });

      const userData = userResponse.data as User;

      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("@MestreDeObra:user");

        if (JSON.parse(storedUser) !== userData) {
          localStorage.setItem("@MestreDeObra:user", JSON.stringify(userData));
          setUser(userData);
        }
      }
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("@MestreDeObra:user");
        setUser(undefined);
      }
      // Catch erros and treat them
      throw new Error(err.code);
    }
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();

    if (typeof window !== "undefined") {
      localStorage.removeItem("@MestreDeObra:user");
      setUser(undefined);
    }
  }, []);

  const validateUserToken = async () => {};

  // const validateUserToken = useCallback(async () => {
  auth.onIdTokenChanged(async (firebaseUser) => {
    if (firebaseUser) {
      const userAuthData = await firebaseUser.getIdTokenResult();
      const userExpirationDate = Date.parse(userAuthData.expirationTime);

      let storedUser: string;

      if (typeof window !== "undefined") {
        storedUser = localStorage.getItem("@MestreDeObra:user");
      }

      if (!storedUser) {
        setUser(undefined);
      }

      const userResponse = await api.get("/firestore/user", {
        params: { uid: firebaseUser.uid },
      });

      const userData = userResponse.data as User;

      if (!isEqual(JSON.parse(storedUser), userData)) {
        localStorage.setItem("@MestreDeObra:user", JSON.stringify(userData));
        setUser(userData);
      }

      if (userExpirationDate <= Date.now()) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("@MestreDeObra:user");
          setUser(undefined);
        }
      }
    }
  });
  // }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, validateUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
