import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import authenticationService from "../services/authentication.service";

const PrivateRoute = () => {
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValidToken(false);
                return;
            }

            try {
                const response = await authenticationService.introspect(token);
                if (response.code === 1000 && (response.result as { valid: boolean }).valid) {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                setIsValidToken(false);
                toast.error("Có lỗi xảy ra khi kiểm tra phiên đăng nhập.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        };

        validateToken();
    }, [token]);

    const redirectPath = location.pathname.includes("/seller") ? "/seller/sign-in" : "/sign-in";

    if (isValidToken === null) {
        return <div>Đang kiểm tra phiên đăng nhập...</div>;
    }

    return isValidToken ? <Outlet /> : (
        <>
            <ToastContainer />
            <Navigate to={redirectPath} replace />
        </>
    );
};

export default PrivateRoute;
