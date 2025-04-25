import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardVoucherSupplier from "../components/CardVoucherSupplier";
import SupplierInfoItem from "../components/SupplierInfoItem";
import Voucher from "../models/voucher.model";
import voucherService from "../services/voucher.service";
import Supplier from "../models/supplier.model";
import supplierService from "../services/supplier.service";

type UserVoucher = {
    id: number,
    voucher: Voucher,
    profileId: string,
    supplierId?: number,
    claimedAt: Date,
    isUse: boolean
}

const DetailSupplier = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [claimedVoucherIds, setClaimedVoucherIds] = useState<number[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [supplier, setSupplier] = useState<Supplier>();
    const { id } = useParams();

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const profileId = localStorage.getItem("profileId");
        setIsLoggedIn(!!profileId);
    }, []);

    const fetchVouchers = async () => {
        try {
            // Lấy danh sách voucher
            const vouchersResponse = await voucherService.getAllVoucherBySupplierId(Number(id));
            setVouchers(vouchersResponse.result as Voucher[]);
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra khi tải danh sách voucher");
        } finally {
            setLoading(false);
        }
    };

    const fetchSupplier = async () => {
        try {
            const response = await supplierService.getSupplierById(Number(id));
            if (response.code === 1000) {
                setSupplier(response.result as Supplier);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra khi lấy thông tin shop");
        } finally {
            setLoading(false);
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
        await fetchSupplier();
        await fetchVouchers();
        if (isLoggedIn) {
            await fetchClaimedVouchers();
        }
    };

    useEffect(() => {
        refreshVouchers();
    }, [isLoggedIn]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                width: "100%",
                boxShadow: "0 1px 1px rgba(0, 0, 0, .05)",
                padding: "1.25rem 0",
                marginBottom: "1.25rem"
            }}>
                {/* Thông tin supplier */}
                <div style={{
                    display: "flex",
                    paddingTop: "1.25rem",
                    width: "1000px",
                    margin: "0 auto",
                    justifyContent: "flex-start"
                }}>
                    <div style={{
                        borderRadius: "0.25rem",
                        height: "8.4375rem",
                        overflow: "hidden",
                        position: "relative",
                        width: "24.375rem",
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}>
                        <div style={{
                            backgroundImage: `url(/assets/supplier-bg.webp)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            width: "100%",
                            height: "100%",
                        }}></div>

                        <div style={{
                            backgroundColor: "rgba(0,0,0,.6)",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            top: 0,
                            position: "absolute",
                        }}></div>

                        <div style={{
                            bottom: "0.625rem",
                            left: "1.25rem",
                            position: "absolute",
                            right: "0.875rem",
                            top: "0.625rem"
                        }}>
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                {/* Image */}
                                <a href="" style={{
                                    width: "5rem",
                                    height: "5rem",
                                    display: "block",
                                    flexShrink: "0",
                                    position: "relative",
                                }}>
                                    {/* Avatar supplier */}
                                    <div style={{
                                        borderRadius: "50%",
                                        borderColor: "hsla(0, 0%, 100%, .4)",
                                        borderWidth: "0.25rem",
                                        boxSizing: "border-box",
                                        cursor: "pointer",
                                        display: "block",
                                        height: "5rem",
                                        width: "5rem",
                                    }}>
                                        <img src="/assets/supplier-avatar.jpg" alt="avatar"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    </div>

                                    {/* Logo mall */}
                                    <div style={{
                                        bottom: "-4px",
                                        left: "50%",
                                        position: "absolute",
                                        transform: "translateX(-50%)"
                                    }}>
                                        <img src="/assets/supplier-mall.png" alt="mall" style={{
                                            width: "4rem",
                                            height: "1rem",
                                        }} />
                                    </div>
                                </a>
                                {/* Information */}
                                <div style={{
                                    color: "#fff",
                                    marginLeft: "0.625rem",
                                    marginTop: "0.625rem",
                                    overflow: "hidden",
                                    position: "relative",
                                }}>
                                    {/* Name supplier */}
                                    <div style={{
                                        fontSize: "1.25rem",
                                        fontWeight: "500",
                                        lineHeight: "1.5rem",
                                        marginBottom: "0.3125rem",
                                        marginTop: "0",
                                        maxHeight: "3rem",
                                        wordWrap: "break-word",
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: "2"
                                    }}>
                                        {supplier?.name}
                                    </div>
                                    {/* Online */}
                                    <div style={{
                                        color: "hsla(0, 0%, 100%, .7)",
                                        fontSize: "0.75rem",
                                        margin: "0.315rem 0 0.375rem",
                                        verticalAlign: "middle",
                                    }}>
                                        Online 2 phút trước
                                    </div>
                                </div>
                            </div>

                            {/* Button follow & chat */}
                            <div style={{
                                display: "flex",
                                marginTop: "0.625rem",
                                position: "relative", color: "#fff",
                                fontSize: "0.75rem",
                                alignItems: "center",
                                textAlign: "center",
                                textTransform: "capitalize",
                            }}>
                                <div style={{
                                    flex: "1",
                                    padding: "0.3125rem 0",
                                    height: "1.5625rem",
                                    marginRight: "0.625rem",
                                    border: "1px solid #fff",
                                    boxSizing: "border-box",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <div style={{ marginRight: "0.625rem", }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-plus" viewBox="0 0 16 16">
                                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                            <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4" />
                                        </svg>
                                    </div>
                                    Theo dõi
                                </div>
                                <div style={{
                                    flex: "1",
                                    padding: "0.3125rem 0",
                                    height: "1.5625rem",
                                    border: "1px solid #fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <div style={{ marginRight: "0.625rem" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
                                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                                        </svg>
                                    </div>
                                    Chat
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, auto)",
                        gap: "20px 50px",
                        color: "#000000CC",
                        textTransform: "capitalize",
                    }}>
                        <SupplierInfoItem
                            label="Sản phẩm"
                            value="203"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shop-window" viewBox="0 0 16 16">
                                    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5m2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5" />
                                </svg>
                            }
                        />
                        <SupplierInfoItem
                            label="Người đang theo dõi"
                            value="185,5k"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                </svg>
                            }
                        />
                        <SupplierInfoItem
                            label="Đang theo"
                            value="29"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                    <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                                </svg>
                            }
                        />
                        <SupplierInfoItem
                            label="Đánh giá"
                            value="4.9 (43,3k đánh giá)"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                                </svg>
                            }
                        />
                        <SupplierInfoItem
                            label="Tỉ lệ phản hồi chat"
                            value="95% (Trong vài giờ)"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                                </svg>
                            }
                        />
                        <SupplierInfoItem
                            label="Tham gia"
                            value="4 năm trước"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                    <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Vouchers */}
            {vouchers.length > 0 ? (
                <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#fff", marginTop: "20px" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)", // Hiển thị 3 voucher mỗi hàng
                            gap: "20px",
                        }}
                    >
                        {vouchers.map((voucher) => (
                            <CardVoucherSupplier
                                key={voucher.id}
                                voucher={voucher}
                                expiryDate={`${new Date(voucher.startDate).toLocaleDateString()} - ${new Date(
                                    voucher.endDate
                                ).toLocaleDateString()}`}
                                isClaimed={isLoggedIn ? claimedVoucherIds.includes(voucher.id) : false}
                                refreshVouchers={refreshVouchers}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
                    <p></p>
                </div>
            )}

            <div>
                
            </div>
        </>
    )
}

export default DetailSupplier;