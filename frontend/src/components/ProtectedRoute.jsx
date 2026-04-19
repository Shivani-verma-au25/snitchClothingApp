import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, role }) => {
    const user = useSelector(state => state.auth?.user);
    const loading  = useSelector(state => state.auth?.loading);
    

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (role && user?.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
};



export default ProtectedRoute;