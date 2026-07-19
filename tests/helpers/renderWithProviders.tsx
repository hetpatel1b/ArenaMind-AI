import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Example providers that could wrap the application
// import { ThemeProvider } from '@/components/theme-provider';
// import { SessionProvider } from 'next-auth/react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient();

interface WrapperProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: WrapperProps) => {
  return (
    <>
      {/* 
        Wrap with your actual application providers here. 
        Example:
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
      */}
      {children}
    </>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as renderWithProviders };
