import { useEffect, useState } from "react";
import CardVoucherWallet from "../components/CardVoucherWallet";
import voucherService from "../services/voucher.service";
import Voucher from "../models/voucher.model";
import { useNavigate } from "react-router-dom";

type UserVoucher = {
    id: number,
    voucher: Voucher,
    profileId: string,
    supplierId?: number,
    claimedAt: Date,
    isUse: boolean
}

const VoucherWallet = () => {
    const navigate = useNavigate();
    const [claimedVouchers, setClaimedVouchers] = useState<any[]>([]);

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

    return (
        <>
            <div style={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "1.5rem"
            }}>
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

                {/* Nav filter */}
                <div style={{
                    height: "46px",
                }}>
                    <ul style={{
                        listStyle: "none",
                        borderBottom: ".0625rem solid #efefef",
                        display: "flex",
                        alignItems: "center",
                        margin: 0,
                        padding: 0,
                    }}>
                        {
                            [
                                { label: "Tất cả" },
                                { label: "Shopee" },
                                { label: "Shop" },
                                { label: "Nạp thẻ & dịch vụ" },
                                { label: "Scan & Pay" },
                                { label: "Dịch vụ tài chính" },
                            ].map((item, index) => (
                                <>
                                    <li key={index} style={{
                                        color: "#555",
                                        fontSize: "1rem",
                                        flex: "1 auto",
                                        padding: "10px",
                                        textAlign: "center",
                                        cursor: "pointer"
                                    }}>
                                        {item.label}
                                    </li>
                                    <hr style={{
                                        border: ".0625rem solid rgba(0, 0, 0, .09)",
                                        height: "0.75rem",
                                        margin: "0.125rem"
                                    }}></hr>
                                </>
                            ))
                        }
                    </ul>
                </div>

                {/* Vouchers */}
                <div
                    style={{
                        marginTop: "1rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1.5rem",
                    }}
                >
                    {claimedVouchers.map((item) => (
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
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default VoucherWallet;