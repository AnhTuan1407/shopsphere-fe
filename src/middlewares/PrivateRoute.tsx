import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
    const { token } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!token) {
            toast.error("Bạn chưa đăng nhập", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [token]);

    const redirectPath = location.pathname.includes("/seller") ? "/seller/sign-in" : "/sign-in";

    return token ? <Outlet /> : (
        <>
            <ToastContainer />
            <Navigate to={redirectPath} replace />
        </>
    );
};

export default PrivateRoute;
