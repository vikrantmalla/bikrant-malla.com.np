import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Enviroment } from "@/types/enum";

export function ZustandProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const isDevtoolsEnabled = process.env.NODE_ENV !== Enviroment.PRODUCTION;

export function createStore<T>(initializer: (set: any) => T, name: string) {
  return create<T>()(
    devtools(initializer, {
      enabled: isDevtoolsEnabled,
      name,
    })
  );
}
