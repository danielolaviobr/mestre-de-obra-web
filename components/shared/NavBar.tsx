import { AnimateSharedLayout, motion } from "framer-motion";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DollarSign, Folder, Home, Plus, User } from "react-feather";

const NavBar = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("home");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(router.pathname);
  }, [router]);

  useEffect(() => {
    if (user) {
      setIsAnonymous(user.isAnonymous);
    }
  }, [user]);

  return (
    <footer
      className={`fixed bottom-0 z-10 flex items-center justify-between w-screen h-20 px-8 bg-black shadow-sm standalone:pt-6 standalone:h-24 pb-safe-top ${
        (router.pathname === "/" ||
          router.pathname === "/anonymous" ||
          isAnonymous) &&
        "hidden"
      }`}>
      <AnimateSharedLayout>
        <button
          className="flex flex-col items-center justify-center focus:outline-none"
          onClick={() => {
            router.push("/dashboard");
            setActivePage("home");
          }}>
          <Home size={30} color="#fff" />
          {activePage === "home" && (
            <motion.div
              className="w-2 h-2 mt-2 bg-white rounded-full"
              layoutId="selected"
            />
          )}
        </button>
        <button
          className="flex flex-col items-center justify-center focus:outline-none"
          onClick={() => {
            router.push("/add-viewer");
            setActivePage("add-viewer");
          }}>
          <User size={30} color="#fff" />

          {activePage === "add-viewer" && (
            <motion.div
              className="w-2 h-2 mt-2 bg-white rounded-full"
              layoutId="selected"
            />
          )}
        </button>
        <button
          className="flex flex-col items-center justify-center focus:outline-none"
          onClick={() => {
            router.push("/upload");
            setActivePage("upload");
          }}>
          <Plus size={30} color="#fff" />

          {activePage === "upload" && (
            <motion.div
              className="w-2 h-2 mt-2 bg-white rounded-full"
              layoutId="selected"
            />
          )}
        </button>
        <button
          className="flex flex-col items-center justify-center focus:outline-none"
          onClick={() => {
            router.push("/create-project");
            setActivePage("create-project");
          }}>
          <Folder size={30} color="#fff" />

          {activePage === "create-project" && (
            <motion.div
              className="w-2 h-2 mt-2 bg-white rounded-full"
              layoutId="selected"
            />
          )}
        </button>
        <button
          className="flex flex-col items-center justify-center focus:outline-none"
          onClick={() => {
            router.push("/pdf/1");
            setActivePage("subscription");
          }}>
          <DollarSign size={30} color="#fff" />

          {activePage === "subscription" && (
            <motion.div
              className="w-2 h-2 mt-2 bg-white rounded-full"
              layoutId="selected"
            />
          )}
        </button>
      </AnimateSharedLayout>
    </footer>
  );
};

export default NavBar;