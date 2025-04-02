import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import bgAuthShopee from "../assets/bg-shopee-auth.png";
import ButtonField from "../components/ButtonField";
import TextField from "../components/TextField";
import { useAuth } from "../contexts/AuthContext";
import authenticationService from "../services/authentication.service";

type SignInFormData = {
    username: string,
    password: string,
}

const schema = yup.object().shape({
    username: yup.string().required("Tên đăng nhập không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
})

const SignIn = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: SignInFormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await authenticationService.login(data);
            if (response.token) {
                await login(response.token);

                toast.success("Đăng nhập thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                });

                navigate("/");
            }
        } catch (error: any) {
            toast.error(
                "Đăng nhập thất bại: " +
                (error.response?.data?.message || "Lỗi không xác định") +
                ". Vui lòng thử lại!",
                { position: "top-right", autoClose: 3000 }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div style={{
                backgroundColor: "#ee4d2d",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    backgroundImage: `url(${bgAuthShopee})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "500px",
                    borderRadius: "8px"
                }}>
                    <div style={{
                        flexBasis: "60%"
                    }}>

                    </div>

                    <div style={{
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        boxShadow: "0 3px 10px 0 rgba(0, 0, 0, .14)",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        flexBasis: "40%",
                        padding: "20px"
                    }}>
                        <div style={{
                            fontSize: "1.5rem",
                            fontWeight: "400",
                            marginBottom: "1rem",
                            textAlign: "center",
                            color: "#333",
                            float: "left"
                        }}>Đăng nhập</div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Username */}
                            <div style={{ marginBottom: "1rem" }}>
                                <TextField placeholder="Nhập tên đăng nhập" {...register("username")} />
                                {errors.username && <span style={{ color: "red", fontWeight: "400" }}>{errors.username.message}</span>}
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: "1rem" }}>
                                <TextField type="password" placeholder="Nhập mật khẩu" {...register("password")} />
                                {errors.password && <span style={{ color: "red", fontWeight: "400" }}>{errors.password.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <ButtonField width="100%">Đăng nhập</ButtonField>
                        </form>

                        <div style={{
                            marginTop: "10px"
                        }}>
                            Bạn lần đầu đến với shopee? <a onClick={() => navigate("/sign-up")} style={{ color: "#ee4d2d" }}>Đăng ký</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
