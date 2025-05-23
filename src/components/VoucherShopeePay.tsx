import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import voucherService from "../services/voucher.service";
import Voucher from "../models/voucher.model";
import VoucherDetail from "../pages/VoucherDetail";

type VoucherProps = {
    voucher: Voucher;
    isClaimed: boolean;
    refreshVouchers: () => void;
};

const VoucherShopeePay: React.FC<VoucherProps> = ({ voucher, isClaimed, refreshVouchers }) => {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        navigate("/");
    }

    const handleClaimVoucher = async () => {
        try {
            const profileId = localStorage.getItem("profileId");
            if (!profileId) {
                navigate("/sign-in");
                toast.error("Đăng nhập để nhận mã giảm giá");
                return;
            }

            const request = {
                voucherId: voucher.id,
                profileId: profileId,
            }

            const response = await voucherService.claimedVoucher(request);
            if (response.code === 1000) {
                toast.success("Bạn đã lưu mã giảm giá thành công!");
                refreshVouchers();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra");
        }
    }

    const handleViewConditions = () => {
        navigate("/vouchers/detail", { state: { voucher } });
    };

    return (
        <div
            style={{
                display: "flex",
                borderTop: "1px solid #ddd",
                borderRight: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
                borderRadius: "5px 8px 8px 5px",
                overflow: "hidden",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            {/* Phần răng cưa bên trái */}
            <div
                style={{
                    backgroundColor: "#ee4d2d",
                    width: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {[...Array(7)].map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: "18px",
                            height: "18px",
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            position: "absolute",
                            left: "-10px",
                            top: `${index * 25}px`,
                            marginTop: "10px",
                            marginBottom: "5px",
                        }}
                    ></div>
                ))}

                <div style={{ textAlign: "center" }}>
                    <img
                        src="/assets/voucher/bg-voucher-shopeepay.png"
                        alt=""
                        style={{
                            width: "70px",
                            height: "70px",
                        }}
                    />
                    <div style={{ fontWeight: "500", color: "#fff" }}>{voucher.code}</div>
                </div>
            </div>

            {/* Phần thông tin voucher */}
            <div
                style={{
                    flex: 1,
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h3 style={{ margin: "0 0 0.5rem", color: "#333" }}>{voucher.title}</h3>
                    <p style={{ margin: "0 0 1rem", color: "#555" }}>{voucher.description}</p>
                </div>

                <div
                    style={{
                        color: isClaimed ? "#ee4d2d" : "#fff",
                        backgroundColor: isClaimed ? "#fff" : "#ee4d2d",
                        fontSize: "1.25rem",
                        border: `2px solid ${isClaimed ? "#ee4d2d" : "#fff"}`,
                        padding: "0.25rem 1.5rem",
                        borderRadius: "0.625rem",
                        fontWeight: "500",
                        textAlign: "center",
                        marginBottom: "0.625rem",
                        cursor: "pointer",
                    }}

                    onClick={isClaimed ? handleBuyNow : handleClaimVoucher}
                >
                    {isClaimed ? "Mua ngay" : "Lưu"}
                </div>

                <div
                    style={{
                        color: "#05a",
                        fontWeight: "500",
                        fontSize: "1rem",
                        textAlign: "right",
                        cursor: "pointer",
                    }}
                    onClick={handleViewConditions}
                >
                    Điều kiện
                </div>
            </div>
        </div>
    );
};

export default VoucherShopeePay;