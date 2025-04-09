import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import bgSellerAuthShopee from "../assets/shopee-seller-bg.png";
import ButtonField from "../components/ButtonField";
import TextField from "../components/TextField";
import supplier from "../services/supplier.service";

// Định nghĩa kiểu dữ liệu form
type SignUpFormData = {
    name: string;
    address: string;
    contactEmail: string;
    phoneNumber: string;
    password: string;
    retypePassword: string;
};

// Schema validate bằng Yup
const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên cửa hàng"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    contactEmail: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    phoneNumber: yup.string().required("Vui lòng nhập số điện thoại"),
    password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
    retypePassword: yup
        .string()
        .oneOf([yup.ref("password")], "Mật khẩu không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
});

const SignUpSeller = () => {
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
            const response = await supplier.createSupplier(data);
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
                    navigate("/seller/sign-in");
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
                backgroundColor: "rgb(253, 250, 247)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px 0 rgba(0, 0, 0, .6)",
            }}
        >
            <div
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    backgroundImage: `url(${bgSellerAuthShopee})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    width: "100%",
                    height: "700px",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "8px",
                    justifyContent: "space-between",
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    maxWidth: "405px",
                    marginLeft: "2.5rem"
                }}>
                    <div style={{ fontSize: "1.5rem", lineHeight: "2.25rem", color: "#ee4d2d" }}>Shopee Việt Nam</div>
                    <div style={{
                        fontSize: "2.25rem",
                        fontWeight: "500",
                        lineHeight: "2.625rem",
                        marginTop: "0.25rem",
                        marginBottom: "0.625rem",
                        color: "#ee4d2d",
                    }}>
                        Trở thành Người bán ngay hôm nay
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1.875rem",
                        marginLeft: "0.35rem",
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" fill="#ee4d2d" className="bi bi-shop" viewBox="0 0 16 16">
                            <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
                        </svg>
                        <div style={{
                            marginLeft: "1.125rem",
                            color: "#ee4d2d",
                            fontSize: "1.125rem",
                        }}>
                            Nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1.875rem",
                    }}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" fill="#ee4d2d" className="bi bi-gift" viewBox="0 0 16 16">
                                <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" />
                            </svg>
                        </div>
                        <div style={{
                            marginLeft: "1rem",
                            color: "#ee4d2d",
                            fontSize: "1.125rem",
                        }}>
                            Phát triển trở thành thương hiệu toàn cầu
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1.875rem",
                    }}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" fill="#ee4d2d" className="bi bi-bag-heart" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M14 14V5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132" />
                            </svg>
                        </div>
                        <div style={{
                            marginLeft: "1rem",
                            color: "#ee4d2d",
                            fontSize: "1.125rem",
                        }}>
                            Dẫn đầu lượng người dùng trên ứng dụng mua sắm tại Việt Nam
                        </div>
                    </div>
                </div>

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
                            textAlign: "left",
                            color: "#333",
                        }}
                    >
                        Đăng ký
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Supplier name */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField placeholder="Nhập tên cửa hàng của bạn" {...register("name")} />
                            {errors.name && <span style={{ color: "red", fontWeight: "400" }}>{errors.name.message}</span>}
                        </div>

                        {/* Phone number */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="tel" placeholder="Nhập số điện thoại" {...register("phoneNumber")} />
                            {errors.phoneNumber && <span style={{ color: "red", fontWeight: "400" }}>{errors.phoneNumber.message}</span>}
                        </div>


                        {/* Email */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="email" placeholder="Nhập email liên hệ" {...register("contactEmail")} />
                            {errors.contactEmail && <span style={{ color: "red", fontWeight: "400" }}>{errors.contactEmail.message}</span>}
                        </div>


                        {/* Address */}
                        <div style={{ marginBottom: "1rem" }}>
                            <TextField type="tel" placeholder="Nhập địa chỉ" {...register("address")} />
                            {errors.address && <span style={{ color: "red", fontWeight: "400" }}>{errors.address.message}</span>}
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

                    <div style={{
                        marginTop: "1.5rem",
                        textAlign: "center",
                        fontSize: "0.75rem",
                        color: "#666",
                    }}>
                        Bạn đã có tài khoản?{" "}
                        <a onClick={() => navigate("/seller/sign-in")} style={{ color: "#ee4d2d", cursor: "pointer" }}>
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpSeller;
