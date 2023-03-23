import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { updateAccessToken } from '../api/auth';
import { STORAGE_KEYS } from '../constants';

import { useAlerts } from './AlertsContext';

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const CustAuthProvider = ({ children }) => {
  const auth0Context = useAuth0();

  const { getAccessTokenSilently, isAuthenticated, user } = auth0Context;

  const [isLoadingAccessToken, setIsLoadingAccessToken] = useState(false);
  const [accessToken, setAccessToken] = useState();
  const { setAlert } = useAlerts();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        setIsLoadingAccessToken(true);
        const token = await updateAccessToken(getAccessTokenSilently);

        setAccessToken(token);
      } catch (err) {
        try {
          console.error('Error while getting access token: ', err);
          const auth0Callback = JSON.parse(
            sessionStorage.getItem(STORAGE_KEYS.AUTH0_CALLBACK_PARAMS) || ''
          );

          if (auth0Callback?.error_description) {
            setAlert(
              'ERROR',
              `Authentication error: ${decodeURIComponent(auth0Callback?.error_description)}`
            );
          }
        } catch (err) {
          console.error('Error while handling auth0 callback error: ', err);
        }
      } finally {
        setIsLoadingAccessToken(false);
      }
    };

    if (!isAuthenticated) {
      getAccessToken();
    }
  }, [isAuthenticated, getAccessTokenSilently, setAlert]);

  return (
    <AuthContext.Provider
      value={{
        ...auth0Context,
        accessToken,
        isLoadingAccessToken,
        isAuthenticated: isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => (
  <Auth0Provider
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    redirectUri={window.location.origin + '/deploy'}
  >
    <CustAuthProvider>{children}</CustAuthProvider>
  </Auth0Provider>
);
