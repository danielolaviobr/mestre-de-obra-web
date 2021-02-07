import React from "react";

import { AuthProvider } from "./auth";
// import { ToastProvider } from './toast';

const HookspProvider: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default HookspProvider;
