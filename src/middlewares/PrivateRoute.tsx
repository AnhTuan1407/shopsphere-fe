import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

const PrivateRoute = () => {
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            toast.error("Bạn chưa đăng nhập");
        }
    }, [token]);

    return token ? <Outlet /> : (
        <>
            <ToastContainer />
            <Navigate to="/auth/sign-in" replace />
        </>
    );
};

export default PrivateRoute;
