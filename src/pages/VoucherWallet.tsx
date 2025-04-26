import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardVoucherWallet from "../components/CardVoucherWallet";
import Voucher from "../models/voucher.model";
import voucherService from "../services/voucher.service";

type UserVoucher = {
    id: number;
    voucher: Voucher;
    profileId: string;
    supplierId?: number;
    claimedAt: Date;
    used: boolean;
};

type GroupedVoucher = {
    id: number;
    voucher: Voucher;
    profileId: string;
    supplierId?: number;
    claimedAt: Date;
    used: boolean;
    totalQuantity: number;
    usedQuantity: number;
    remainingQuantity: number;
};

const VoucherWallet = () => {
    const navigate = useNavigate();
    const [claimedVouchers, setClaimedVouchers] = useState<UserVoucher[]>([]);
    const [activeTab, setActiveTab] = useState<string>("all");

    useEffect(() => {
        const fetchClaimedVouchers = async () => {
            try {
                const profileId = localStorage.getItem("profileId");
                if (!profileId) {
                    console.error("User is not logged in");
                    return;
                }

                const response = await voucherService.getClaimedVouchersByUser(profileId);
                if (response.code === 1000) {
                    setClaimedVouchers(response.result as UserVoucher[]);
                } else {
                    console.error("Failed to fetch claimed vouchers:", response.message);
                }
            } catch (error) {
                console.error("Error fetching claimed vouchers:", error);
            }
        };

        fetchClaimedVouchers();
    }, []);

    // Nhóm các voucher theo id và tính toán số lượng còn lại
    const groupedVouchers = claimedVouchers.reduce((acc, item) => {
        const existing = acc.find((v) => v.voucher.id === item.voucher.id);
        if (existing) {
            existing.totalQuantity += 1;
            if (item.used) {
                existing.usedQuantity += 1;
            }
            existing.remainingQuantity = existing.totalQuantity - existing.usedQuantity;
        } else {
            acc.push({
                ...item,
                totalQuantity: 1,
                usedQuantity: item.used ? 1 : 0,
                remainingQuantity: item.used ? 0 : 1
            });
        }
        return acc;
    }, [] as GroupedVoucher[]);

    const isVoucherExpired = (voucher: Voucher) => {
        const now = new Date();
        const endDate = new Date(voucher.endDate);
        return now > endDate;
    };

    const filterVouchers = () => {
        switch (activeTab) {
            case "unused":
                return groupedVouchers.filter(
                    item => item.remainingQuantity > 0 && !isVoucherExpired(item.voucher)
                );
            case "used":
                return groupedVouchers.filter(item => item.usedQuantity === item.totalQuantity);
            case "expired":
                return groupedVouchers.filter(item => isVoucherExpired(item.voucher));
            default:
                return groupedVouchers;
        }
    };

    const filteredVouchers = filterVouchers();

    const navTabs = [
        { id: "all", label: "Tất cả" },
        { id: "unused", label: "Chưa sử dụng" },
        { id: "used", label: "Đã sử dụng" },
        { id: "expired", label: "Quá hạn" }
    ];

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "1.5rem",
            }}
        >

            {/* Title */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <div style={{
                    fontSize: "1.25rem"
                }}>
                    Kho Voucher
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "0.85rem" }}>
                    <div style={{
                        color: "#ee4d2d",
                        paddingRight: "0.5rem",
                        borderRight: "1px solid #757575",
                        cursor: "pointer"
                    }}
                        onClick={() => navigate("/vouchers")}
                    >
                        Tìm hiểu thêm voucher
                    </div>
                    <div style={{
                        color: "#ee4d2d",
                        paddingRight: "0.5rem",
                        paddingLeft: "0.5rem",
                        borderRight: "1px solid #757575",
                        cursor: "pointer"
                    }}>
                        Xem lịch sử voucher
                    </div>
                    <div style={{ color: "#757575", paddingLeft: "0.5rem", cursor: "pointer" }}>Tìm hiểu</div>
                </div>
            </div>

            {/* Search */}
            <div style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, .03)",
                justifyContent: "center",
                marginTop: "1.25rem",
                padding: "1.75rem 2.75rem"
            }}>
                <div style={{ fontSize: "1rem", textTransform: "capitalize" }}>Mã Voucher</div>
                <div style={{
                    margin: "0 0.5rem 0 0.875rem",
                    border: "1px solid rgba(0, 0, 0, .14)",
                    boxShadow: "inset 0 2px 0 0 rgba(0, 0, 0, .02)",
                    height: "2.75rem",
                    padding: "0.8125rem",
                    width: "25.875rem",
                    display: "flex"
                }}>
                    <input type="text" placeholder="Nhập mã voucher tại đây"
                        style={{
                            outline: "none",
                            flex: "1",
                            border: "none",
                            backgroundColor: "transparent",
                        }} />
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "",
                    backgroundColor: "rgba(0, 0, 0, .1)",
                    borderRadius: "0.125rem",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .09)",
                    color: "#fff",
                    height: "2.75rem",
                    justifyContent: "center",
                    outline: "none",
                    width: "6.25rem"
                }}>
                    Lưu
                </div>
            </div>

            {/* Navigation Bar */}
            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #f1f1f1",
                    marginBottom: "1.5rem",
                }}
            >
                {navTabs.map(tab => (
                    <div
                        key={tab.id}
                        style={{
                            padding: "0.75rem 1rem",
                            cursor: "pointer",
                            fontWeight: activeTab === tab.id ? "bold" : "normal",
                            color: activeTab === tab.id ? "#ee4d2d" : "#757575",
                            borderBottom: activeTab === tab.id ? "2px solid #ee4d2d" : "none",
                        }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Vouchers Grid */}
            <div
                style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.5rem",
                }}
            >
                {filteredVouchers.length > 0 ? (
                    filteredVouchers.map((item) => (
                        <CardVoucherWallet
                            key={item.voucher.id}
                            voucher={item.voucher}
                            backgroundColor={
                                item.voucher.voucherType === "SHIPPING" ? "rgb(38, 170, 153)" : "#ee4d2d"
                            }
                            imageSrc={
                                item.voucher.voucherType === "SHIPPING"
                                    ? "/assets/voucher/bg-voucher-shipping.png"
                                    : "/assets/voucher/bg-voucher-shopeepay.png"
                            }
                            quantity={item.remainingQuantity > 0 ? item.remainingQuantity : item.totalQuantity}
                            isExpired={isVoucherExpired(item.voucher)}
                            isUsed={item.usedQuantity === item.totalQuantity}
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: "span 2",
                        textAlign: "center",
                        padding: "2rem",
                        color: "#757575"
                    }}>
                        Không có voucher nào trong danh mục này
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherWallet;