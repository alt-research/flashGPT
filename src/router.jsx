import { Navigate } from "react-router-dom";
import ChatGPT from "./ChatGPT";
import BaseLayout from "./components/BaseLayout";
import NavigationLayout from "./components/NavigationLayout";
import SuspenseLoader from "./components/SuspenseLoader";
import { useAuthContext } from "./contexts/AuthContext";
import DeployFL from "./DeployFL";

const ProtectedRoute = ({
    children,
}) => {
    const { isAuthenticated, isLoading, isLoadingAccessToken } = useAuthContext();


    return isLoading || isLoadingAccessToken ? (
        <SuspenseLoader />
    ) : isAuthenticated ? (
        children
    ) : (
        <Navigate replace to="/generate" />
    );
};


const routes = [
    {
        path: '',
        element: <BaseLayout/>,
        children: [
            {
                path: '',
                element: <Navigate replace to={'/generate'} />,
            },
            {
                path: 'generate',
                element: <ChatGPT />,
            },
            {
                path: 'deploy',
                element: <NavigationLayout/>,
                children: [
                    {
                        path: "",
                        element: <ProtectedRoute
                        >
                          <DeployFL />
                        </ProtectedRoute>
                    }
                ]
              },
        ],
    }
];

export default routes;