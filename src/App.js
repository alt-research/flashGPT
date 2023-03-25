import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRoutes } from 'react-router-dom';
import { AlertsProvider, useAlerts } from './contexts/AlertsContext';
import { AuthProvider } from './contexts/AuthContext';
import routes from './router';

import '@rainbow-me/rainbowkit/styles.css';

import { WagmiProvider } from './contexts/WagmiContext';

const App = () => {
  const content = useRoutes(routes);

  const QueryClientProviderWrapper = ({ children, ...props }) => {
    const { setAlert } = useAlerts();

    const mutationCache = new MutationCache({
      // Default error handling function. Will not be executed if useMutation already defines an onError callback.
      onError: (error, _variables, _context, mutation) => {
        // If this mutation has an onError defined, skip this
        if (mutation.options.onError) return;

        // any error handling code...
        console.error(error);
        setAlert('ERROR', error?.response?.data?.message || 'Api submission failed');
      },
    });

    const queryCache = new QueryCache({
      onError: error => {
        setAlert('ERROR', error?.response?.data?.message || 'Fetch failed');
      },
    });

    const queryClient = new QueryClient({
      queryCache,
      mutationCache,
      defaultOptions: {
        queries: {
          /**
           * @param refetchOnWindowFocus
           * @description This is disabled temporarily to avoid confusion during development,
           * e.g. when an additional query is noticed on the network tab, a dev might think it is due to an unnecessary re-render.
           * @todo Consider enabling it in production as this could give a small UX boost.
           */
          refetchOnWindowFocus: false,
          staleTime: 60000,
          retry: false, // set to false for now, to avoid reaching postman mock server rate limit
        },
      },
    });

    return (
      <QueryClientProvider client={queryClient} {...props}>
        {children}
      </QueryClientProvider>
    );
  };
  return (
    <AlertsProvider>
      <QueryClientProviderWrapper>
        <WagmiProvider>
          <AuthProvider>{content}</AuthProvider>
        </WagmiProvider>
      </QueryClientProviderWrapper>
    </AlertsProvider>
  );
};

export default App;
