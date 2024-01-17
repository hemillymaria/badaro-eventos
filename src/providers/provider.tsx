"use client";

import DefaultProvider from "@/contexts/default";
import { SessionProvider } from "next-auth/react";


export function Providers({ children }: { children: React.ReactNode }) {
  return (

    <SessionProvider>
      <DefaultProvider>
        {children}

      </DefaultProvider>

    </SessionProvider>
  )
}