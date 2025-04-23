import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import voucherService from "../services/voucher.service";
import Voucher from "../models/voucher.model";

type VoucherProps = {
    voucher: Voucher;
    isClaimed: boolean;
    expiryDate: string;
    refreshVouchers: () => void;
};

const CardVoucherSupplier: React.FC<VoucherProps> = ({ voucher, expiryDate, isClaimed, refreshVouchers }) => {
    const navigate = useNavigate();
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
                supplierId: voucher.creatorId,
            };

            const response = await voucherService.claimedVoucher(request);
            if (response.code === 1000) {
                toast.success("Bạn đã lưu mã giảm giá thành công!");
                refreshVouchers();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra");
        }
    };

    const handleBuyNow = () => {
        navigate("/");
    };

    const handleViewConditions = () => {
        navigate("/vouchers/detail", { state: { voucher } });
    };

    return (
        <div
            style={{
                display: "flex",
                border: "1px solid #f5c2c7",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff4f4",
                maxWidth: "320px",
                position: "relative",
            }}
        >
            {/* Phần bên trái */}
            <div
                style={{
                    flex: 2,
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    borderRight: "2px dashed #f5c2c7",
                }}
            >
                {/* Nội dung bên trái */}
                <div>
                    <h3 style={{ margin: "0 0 0.5rem", color: "#d0011b", fontSize: "1rem", fontWeight: "bold" }}>
                        {voucher.title}
                    </h3>
                    <p style={{ margin: "0 0 0.5rem", color: "#d0011b", fontSize: "0.875rem" }}>
                        {voucher.description}
                    </p>
                    <p style={{ margin: "0", color: "#999", fontSize: "0.75rem" }}>
                        HSD: {expiryDate}
                    </p>
                </div>
            </div>

            {/* Phần bên phải */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#fff4f4",
                    position: "relative",
                }}
            >
                {/* Số lượng */}
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#d0011b",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        padding: "2px 6px",
                        borderRadius: "12px",
                    }}
                >
                    x{voucher.perUserLimit}
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "20px"
                }}>
                    {/* Nút lưu */}
                    <div
                        style={{
                            color: "#fff",
                            backgroundColor: "#d0011b",
                            fontSize: "0.875rem",
                            border: `1px solid #d0011b`,
                            padding: "0.5rem 1rem",
                            borderRadius: "0.625rem",
                            textAlign: "center",
                            cursor: "pointer",
                            boxSizing: "border-box",
                        }}
                        onClick={isClaimed ? handleBuyNow : handleClaimVoucher}
                    >
                        {isClaimed ? "Dùng ngay" : "Lưu"}
                    </div>

                    <div
                        style={{
                            color: "#05a",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            textAlign: "center",
                        }}

                        onClick={handleViewConditions}
                    >
                        Điều kiện
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVoucherSupplier;