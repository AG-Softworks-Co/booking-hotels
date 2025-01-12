"use client";

import { createContext, useContext, useState } from "react";
import { Toaster as SonnerToaster, toast as sonner } from "sonner";

interface ToastContextProps {
  toast: (message: { description: string }) => void;
}

const ToastContext = createContext<ToastContextProps>({
  toast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = (message: { description: string }) => {
    sonner(message.description);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <SonnerToaster richColors />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};