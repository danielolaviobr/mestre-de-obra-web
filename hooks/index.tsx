import React from "react";
import { AuthProvider } from "./auth";

const HookspProvider: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default HookspProvider;
