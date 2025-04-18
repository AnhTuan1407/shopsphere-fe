import { useEffect, useState } from "react";
import VoucherShipping from "../components/VoucherShipping";
import VoucherShopeePay from "../components/VoucherShopeePay";
import Voucher from "../models/voucher.model";
import voucherService from "../services/voucher.service";

type UserVoucher = {
    id: number,
    voucher: Voucher,
    profileId: string,
    supplierId?: number,
    claimedAt: Date,
    isUse: boolean
}

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [claimedVoucherIds, setClaimedVoucherIds] = useState<number[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const profileId = localStorage.getItem("profileId");
        setIsLoggedIn(!!profileId);
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await voucherService.getAllVouchers();
            if (response.code === 1000) {
                setVouchers(response.result as Voucher[]);
            } else {
                console.error("Failed to fetch vouchers:", response.message);
            }
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };

    const fetchClaimedVouchers = async () => {
        try {
            const profileId = localStorage.getItem("profileId");
            const response = await voucherService.getClaimedVouchersByUser(profileId || "");
            if (response.code === 1000) {
                const claimedId = (response.result as UserVoucher[]).map((uv) => uv.voucher.id);
                setClaimedVoucherIds(claimedId);
            } else {
                console.error("Failed to fetch claimed vouchers:", response.message);
            }
        } catch (error) {
            console.error("Error fetching claimed vouchers:", error);
        }
    };

    const refreshVouchers = async () => {
        await fetchVouchers();
        if (isLoggedIn) {
            await fetchClaimedVouchers();
        }
    };

    useEffect(() => {
        refreshVouchers();
    }, [isLoggedIn]);

    const shippingVouchers = vouchers.filter((voucher) => voucher.voucherType === "SHIPPING");
    const shopeePayVouchers = vouchers.filter((voucher) => voucher.voucherType === "SHOPEE_PAY");

    return (
        <div style={{ width: "1200px", margin: "0 auto", padding: "1.5rem", backgroundColor: "#fff" }}>
            {/* Khu vực voucher SHIPPING */}
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ marginBottom: "1rem", color: "#333" }}>Voucher Miễn Phí Vận Chuyển</h2>
                <div
                    style={{
                        display: "grid",
                        gap: "1.5rem",
                        gridTemplateColumns: "repeat(3, 1fr)",
                    }}
                >
                    {shippingVouchers.map((voucher) => (
                        <VoucherShipping
                            key={voucher.id}
                            voucher={voucher}
                            isClaimed={isLoggedIn ? claimedVoucherIds.includes(voucher.id) : false}
                            refreshVouchers={refreshVouchers}
                        />
                    ))}
                </div>
            </div>

            {/* Khu vực voucher SHOPEE_PAY */}
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ marginBottom: "1rem", color: "#333" }}>Voucher ShopeePay</h2>
                <div
                    style={{
                        display: "grid",
                        gap: "1.5rem",
                        gridTemplateColumns: "repeat(3, 1fr)",
                    }}
                >
                    {shopeePayVouchers.map((voucher) => (
                        <VoucherShopeePay
                            key={voucher.id}
                            voucher={voucher}
                            isClaimed={isLoggedIn ? claimedVoucherIds.includes(voucher.id) : false}
                            refreshVouchers={refreshVouchers}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VoucherPage;