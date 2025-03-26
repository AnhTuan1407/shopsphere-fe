import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import bgAuthShopee from "../assets/bg-shopee-auth.png";
import ButtonField from "../components/ButtonField";
import TextField from "../components/TextField";
import authenticationService from "../services/authentication.service";

// Định nghĩa kiểu dữ liệu form
type SignUpFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    retypePassword: string;
};

// Schema validate bằng Yup
const schema = yup.object().shape({
    firstName: yup.string().required("Vui lòng nhập họ"),
    lastName: yup.string().required("Vui lòng nhập tên"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    phoneNumber: yup.string().required("Vui lòng nhập số điện thoại"),
    username: yup.string().min(4, "Tên đăng nhập ít nhất 4 ký tự").required("Vui lòng nhập tên đăng nhập"),
    password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
    retypePassword: yup
        .string()
        .oneOf([yup.ref("password")], "Mật khẩu không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
});

const SignUp = () => {
    const navigate = useNavigate();

    // Hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
    });

    // Xử lý submit form
    const onSubmit = async (data: SignUpFormData) => {
        try {
            const response = await authenticationService.register(data);
            if (response) {
                toast.success("Đăng ký thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate("/sign-in");
                }, 1500);

            }
        } catch (error: any) {
            toast.error("Đăng ký thất bại: " + error.response.data.message + ". Vui lòng thử lại!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error("Lỗi khi đăng ký:", error);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#ee4d2d",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    backgroundImage: `url(${bgAuthShopee})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "500px",
                    borderRadius: "8px",
                }}
            >
                <div style={{ flexBasis: "60%" }}></div>

                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        boxShadow: "0 3px 10px 0 rgba(0, 0, 0, .14)",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        flexBasis: "40%",
                        padding: "20px",
                    }}
                >
                    {/* Title */}
                    <div
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "400",
                            marginBottom: "1rem",
                            textAlign: "center",
                            color: "#333",
                        }}
                    >
                        Đăng ký
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* First Name */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField placeholder="Nhập họ của bạn" {...register("firstName")} />
                            {errors.firstName && <span style={{ color: "red", fontWeight: "400" }}>{errors.firstName.message}</span>}
                        </div>

                        {/* Last Name */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField placeholder="Nhập tên của bạn" {...register("lastName")} />
                            {errors.lastName && <span style={{ color: "red", fontWeight: "400" }}>{errors.lastName.message}</span>}
                        </div>


                        {/* Email */}

                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="email" placeholder="Nhập email của bạn" {...register("email")} />
                            {errors.email && <span style={{ color: "red", fontWeight: "400" }}>{errors.email.message}</span>}
                        </div>


                        {/* Phone Number */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="tel" placeholder="Nhập số điện thoại của bạn" {...register("phoneNumber")} />
                            {errors.phoneNumber && <span style={{ color: "red", fontWeight: "400" }}>{errors.phoneNumber.message}</span>}
                        </div>


                        {/* Username */}
                        <div style={{ marginBottom: "1rem" }}><TextField placeholder="Nhập tên đăng nhập" {...register("username")} />
                            {errors.username && <span style={{ color: "red", fontWeight: "400" }}>{errors.username.message}</span>}
                        </div>


                        {/* Password */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="password" placeholder="Nhập mật khẩu" {...register("password")} />
                            {errors.password && <span style={{ color: "red", fontWeight: "400" }}>{errors.password.message}</span>}
                        </div>


                        {/* Re-type Password */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="password" placeholder="Nhập lại mật khẩu" {...register("retypePassword")} />
                            {errors.retypePassword && <span style={{ color: "red", fontWeight: "400" }}>{errors.retypePassword.message}</span>}
                        </div>


                        {/* Submit Button */}
                        <ButtonField width="100%">Đăng ký</ButtonField>
                    </form>

                    <div style={{ marginTop: "10px" }}>
                        Bạn đã có tài khoản?{" "}
                        <a onClick={() => navigate("/sign-in")} style={{ color: "#ee4d2d", cursor: "pointer" }}>
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
