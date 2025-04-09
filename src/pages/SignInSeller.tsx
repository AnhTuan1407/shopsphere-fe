import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import ButtonField from "../components/ButtonField";
import TextField from "../components/TextField";
import { useAuth } from "../contexts/AuthContext";
import authenticationService from "../services/authentication.service";
import sellerSignInBg from "../assets/seller-sign-in-bg.png";

type SignInFormData = {
    username: string,
    password: string,
}

const schema = yup.object().shape({
    username: yup.string().required("Tên đăng nhập không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
})

const SignInSeller = () => {

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

                navigate("/seller");
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
                backgroundColor: "#fff",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px 0 rgba(0, 0, 0, .6)",
            }}>
                <div style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "500px",
                    borderRadius: "8px",
                    justifyContent: "space-between",
                }}>
                    <div style={{
                        maxWidth: "400px",
                    }}>
                        <div style={{
                            fontSize: "2rem",
                            color: "#ee4d2d",
                            lineHeight: "3.5625rem",

                        }}>Bán hàng chuyên nghiệp</div>
                        <div style={{
                            fontSize: "1.125rem",
                            color: "#666",
                            lineHeight: "1.5rem",
                            marginBottom: "2rem"
                        }}>Quản lý shop của bạn một cách hiệu quả hơn trên Shopee với Shopee - Kênh Người bán</div>

                        <img src={sellerSignInBg} alt="sign-in-bg" style={{
                            width: "100%",
                            objectFit: "cover",
                        }} />
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
                            color: "#05a",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "0.75rem",
                        }}>
                            <div>Quên mật khẩu</div>
                            <div>Đăng nhập với SMS</div>
                        </div>

                        <div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{
                                    backgroundColor: "#dbdbdb",
                                    flex: "1",
                                    height: "1px",
                                    width: "100%",
                                }}></div>

                                <div style={{
                                    color: "#ccc",
                                    fontSize: "0.75rem",
                                    padding: "0 1rem",
                                    textTransform: "uppercase",
                                }}>
                                    hoặc
                                </div>

                                <div style={{
                                    backgroundColor: "#dbdbdb",
                                    flex: "1",
                                    height: "1px",
                                    width: "100%",
                                }}></div>
                            </div>

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "1rem",
                            }}>
                                <button style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#fff",
                                    border: "1px solid rgba(0, 0, 0, .26)",
                                    padding: "10px 0",
                                    flex: "1",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" className="bi bi-facebook" viewBox="0 0 16 16">
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                    </svg>
                                    <div style={{ marginLeft: "0.5rem" }}>Facebook</div>
                                </button>
                                <button style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#fff",
                                    border: "1px solid rgba(0, 0, 0, .26)",
                                    padding: "10px 0",
                                    flex: "1",
                                    cursor: "pointer",
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                        <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                                    </svg>
                                    <div style={{ marginLeft: "0.5rem" }}>Google</div>
                                </button>
                            </div>
                        </div>

                        <div style={{
                            marginTop: "1.5rem",
                            textAlign: "center",
                            fontSize: "0.75rem",
                            color: "#666",
                        }}>
                            Bạn lần đầu đến với shopee? <a onClick={() => navigate("/seller/sign-up")} style={{ color: "#ee4d2d" }}>Đăng ký</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignInSeller;
