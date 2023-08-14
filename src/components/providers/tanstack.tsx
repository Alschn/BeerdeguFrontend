"use client";

import {
  QueryClient,
  QueryClientProvider as BaseQueryClientProvider,
} from "@tanstack/react-query";
import { type FC, type ReactNode, useState } from "react";

interface TanstackQueryClientProviderProps {
  children: ReactNode;
}

const QueryClientProvider: FC<TanstackQueryClientProviderProps> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  );
};

export default QueryClientProvider;
