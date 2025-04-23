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
    isUse: boolean;
};

const VoucherWallet = () => {
    const navigate = useNavigate();
    const [claimedVouchers, setClaimedVouchers] = useState<UserVoucher[]>([]);

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

    // Nhóm các voucher theo id
    const groupedVouchers = claimedVouchers.reduce((acc, item) => {
        const existing = acc.find((v) => v.voucher.id === item.voucher.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            acc.push({ ...item, quantity: 1 });
        }
        return acc;
    }, [] as (UserVoucher & { quantity: number })[]);

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "1.5rem",
            }}
        >
            <div
                style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.5rem",
                }}
            >
                {groupedVouchers.map((item) => (
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
                        quantity={item.quantity}
                    />
                ))}
            </div>
        </div>
    );
};

export default VoucherWallet;