import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import routes from './router';

const App = () => {
  const content = useRoutes(routes);
  return <AuthProvider>{content}</AuthProvider>;
};

export default App;
