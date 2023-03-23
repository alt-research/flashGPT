import { Alert, Grid, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const alertSeverity = {
  ERROR: 'error',
  DEBUG: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
};

export const AlertsContext = createContext({});

export const useAlerts = () => {
  return useContext(AlertsContext);
};

export const AlertsProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const setAlert = useCallback((alertType, message, error, timeout = 5000) => {
    if (error) {
      console.error(error);
    }

    setAlerts(state => {
      if (state?.find(cur => cur.message === message)) {
        return state;
      }

      return [{ type: alertType, message }, ...state];
    });
    setTimeout(() => {
      // remove alert after timeout
      setAlerts(state => state.filter(cur => cur?.message !== message));
    }, timeout);
  }, []);

  const removeAlert = message => {
    setAlerts(state => state.filter(cur => cur.message !== message));
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(cur => cur.type !== 'DEBUG');
  }, [alerts]);

  return (
    <AlertsContext.Provider value={{ setAlert, removeAlert }}>
      {children}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={filteredAlerts?.length > 0}
        sx={{ flexDirection: 'column' }}
      >
        <Grid container flexDirection="column" rowGap={1}>
          {filteredAlerts?.map(cur => (
            <Alert
              key={cur.message}
              onClose={() => {
                removeAlert(cur.message);
              }}
              severity={alertSeverity[cur.type]}
              variant="filled"
            >
              {cur.message}
            </Alert>
          ))}
        </Grid>
      </Snackbar>
    </AlertsContext.Provider>
  );
};
