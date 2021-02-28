import { auth } from "@firebase";
import getAnonymousUser from "@functions/firestore/getAnonymousUser";
import getUser from "@functions/firestore/getUser";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isEqual from "react-fast-compare";

interface User {
  email: string;
  name: string;
  uid: string;
  projects: Array<{ name: string; isCreator: boolean }>;
  stripeId: string;
  stripeLink: string;
  isSubscribed: boolean;
  phone: string;
  isAnonymous: boolean;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
  anonymousSignIn(phone: string): Promise<void>;
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

      const userData = await getUser(authenticadedUser.user.uid);

      if (!userData) {
        throw new Error("No user found on DB");
      }

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

  const anonymousSignIn = useCallback(async (phone: string) => {
    await auth.signInAnonymously();
    const anonymousUser = await getAnonymousUser(phone);

    if (typeof window !== "undefined" && anonymousUser) {
      localStorage.setItem("@MestreDeObra:user", JSON.stringify(anonymousUser));
      setUser(anonymousUser);
    }
  }, []);

  useEffect(() => {
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

        try {
          if (JSON.parse(storedUser).isAnonymous) {
            return;
          }
          const userData = await getUser(firebaseUser.uid);

          if (!isEqual(JSON.parse(storedUser), userData)) {
            localStorage.setItem(
              "@MestreDeObra:user",
              JSON.stringify(userData)
            );
            setUser(userData);
          }

          if (userExpirationDate <= Date.now()) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("@MestreDeObra:user");
              setUser(undefined);
            }
          }
        } catch (err) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("@MestreDeObra:user");
            setUser(undefined);
          }
        }
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, anonymousSignIn }}>
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
