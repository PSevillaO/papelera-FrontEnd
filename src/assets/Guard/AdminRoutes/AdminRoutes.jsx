import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function AdminRoutes({ children }) {
    const isAdmin = true;

    return (
        isAdmin ? children : <Navigate to='/' replace />
    )
}