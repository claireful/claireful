import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export const PrivateRoutes = () => {
    let { authTokens } = useContext(AuthContext);
    return (
        <div>
            {authTokens === null ? <Navigate to="/login" /> : <Outlet />}
        </div>
    )
}
