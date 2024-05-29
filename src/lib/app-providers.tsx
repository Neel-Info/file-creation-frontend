"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MultiSelectTheme } from "chakra-multiselect";

const queryClient = new QueryClient();
const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
});

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  );
}
