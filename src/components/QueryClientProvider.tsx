"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on focus
      refetchOnReconnect: false, // Disable refetch on reconnect
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    },
  },
});

export const ReactQueryClientProvider = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
