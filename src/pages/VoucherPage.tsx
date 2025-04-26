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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("all"); // "all", "shipping", "shopeepay"

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const profileId = localStorage.getItem("profileId");
        setIsLoggedIn(!!profileId);
    }, []);

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const response = await voucherService.getAllVouchers();
            if (response.code === 1000) {
                // Lọc voucher có startDate từ ngày hôm nay trở đi
                const allVouchers = response.result as Voucher[];
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày để so sánh chính xác

                const validVouchers = allVouchers.filter(voucher => {
                    const startDate = new Date(voucher.startDate);
                    return startDate >= today;
                });

                setVouchers(validVouchers);
            } else {
                console.error("Failed to fetch vouchers:", response.message);
            }
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        } finally {
            setIsLoading(false);
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

    // Các style cho trang
    const styles = {
        pageWrapper: {
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)",
            minHeight: "100vh",
            padding: "30px 0",
        },
        container: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0",
        },
        header: {
            background: "linear-gradient(135deg, #ee4d2d 0%, #ff7337 100%)",
            padding: "30px 40px",
            borderRadius: "10px 10px 0 0",
            boxShadow: "0 4px 20px rgba(238, 77, 45, 0.15)",
            marginBottom: "0",
            position: "relative" as const,
        },
        pageTitle: {
            fontSize: "2.5rem",
            color: "#fff",
            margin: "0",
            textAlign: "center" as const,
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
        },
        pageSubtitle: {
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center" as const,
            marginTop: "10px",
            fontWeight: "normal",
        },
        tabsContainer: {
            display: "flex",
            justifyContent: "center",
            background: "#fff",
            borderBottom: "1px solid #eee",
            position: "sticky" as const,
            top: "0",
            zIndex: 10,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        },
        tab: {
            padding: "15px 30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#555",
            transition: "all 0.3s ease",
            borderBottom: "3px solid transparent",
        },
        activeTab: {
            color: "#ee4d2d",
            borderBottom: "3px solid #ee4d2d",
        },
        contentContainer: {
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
        sectionContainer: {
            marginBottom: "40px",
        },
        sectionHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "25px",
            borderBottom: "2px dashed #f0f0f0",
            paddingBottom: "15px",
        },
        sectionTitle: {
            display: "flex",
            alignItems: "center",
            color: "#333",
            fontSize: "1.8rem",
            fontWeight: "bold",
        },
        titleHighlight: {
            color: "#ee4d2d",
        },
        icon: {
            width: "32px",
            height: "32px",
            marginRight: "15px",
            backgroundColor: "#ee4d2d",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "1.2rem",
        },
        refreshButton: {
            backgroundColor: "#ee4d2d",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "50px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            transition: "transform 0.3s, background-color 0.3s",
            boxShadow: "0 4px 6px rgba(238, 77, 45, 0.2)",
        },
        refreshButtonHover: {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(238, 77, 45, 0.25)",
        },
        voucherGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "25px",
        },
        emptyMessage: {
            padding: "40px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            textAlign: "center" as const,
            color: "#666",
            border: "2px dashed #ddd",
            margin: "20px 0",
        },
        emptyIcon: {
            fontSize: "3rem",
            color: "#ddd",
            marginBottom: "15px",
        },
        loadingContainer: {
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            width: "100%",
        },
        loadingSpinner: {
            width: "50px",
            height: "50px",
            border: "5px solid rgba(238, 77, 45, 0.1)",
            borderRadius: "50%",
            borderTop: "5px solid #ee4d2d",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
        },
        loadingText: {
            color: "#666",
            fontSize: "1.1rem",
        },
    };

    // CSS animation for loading spinner
    const customStyles = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .section-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        
        .voucher-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .voucher-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .refresh-btn {
            position: relative;
            overflow: hidden;
        }
        
        .refresh-btn:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
        }
        
        .refresh-btn:hover:after {
            animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0, 0);
                opacity: 0.5;
            }
            100% {
                transform: scale(20, 20);
                opacity: 0;
            }
        }
    `;

    return (
        <div style={styles.pageWrapper}>
            <style>{customStyles}</style>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.pageTitle}>🏷️ Ưu Đãi Voucher</h1>
                    <p style={styles.pageSubtitle}>Khám phá và sử dụng các ưu đãi hấp dẫn từ Shopee</p>
                </header>

                <div style={styles.tabsContainer}>
                    <div
                        style={{
                            ...styles.tab,
                            ...(activeTab === "all" ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab("all")}
                    >
                        Tất cả voucher
                    </div>
                    <div
                        style={{
                            ...styles.tab,
                            ...(activeTab === "shipping" ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab("shipping")}
                    >
                        Miễn phí vận chuyển
                    </div>
                    <div
                        style={{
                            ...styles.tab,
                            ...(activeTab === "shopeepay" ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab("shopeepay")}
                    >
                        ShopeePay
                    </div>
                </div>

                <div style={styles.contentContainer}>
                    {isLoading ? (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingSpinner}></div>
                            <p style={styles.loadingText}>Đang tải voucher...</p>
                        </div>
                    ) : (
                        <>
                            {/* Hiển thị các voucher dựa trên tab đang chọn */}
                            {(activeTab === "all" || activeTab === "shipping") && (
                                <div style={styles.sectionContainer} className="section-fade-in">
                                    <div style={styles.sectionHeader}>
                                        <div style={styles.sectionTitle}>
                                            <div style={styles.icon}>🚚</div>
                                            <span>Voucher <span style={styles.titleHighlight}>Miễn Phí Vận Chuyển</span></span>
                                        </div>
                                        <button
                                            style={styles.refreshButton}
                                            className="refresh-btn"
                                            onClick={refreshVouchers}
                                            onMouseEnter={(e) => {
                                                // @ts-ignore
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                // @ts-ignore
                                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(238, 77, 45, 0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                // @ts-ignore
                                                e.currentTarget.style.transform = "translateY(0)";
                                                // @ts-ignore
                                                e.currentTarget.style.boxShadow = "0 4px 6px rgba(238, 77, 45, 0.2)";
                                            }}
                                        >
                                            <span style={{ marginRight: "8px" }}>↻</span> Làm mới
                                        </button>
                                    </div>

                                    {shippingVouchers.length > 0 ? (
                                        <div style={styles.voucherGrid}>
                                            {shippingVouchers.map((voucher) => (
                                                <div key={voucher.id} className="voucher-hover">
                                                    <VoucherShipping
                                                        voucher={voucher}
                                                        isClaimed={isLoggedIn ? claimedVoucherIds.includes(voucher.id) : false}
                                                        refreshVouchers={refreshVouchers}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={styles.emptyMessage}>
                                            <div style={styles.emptyIcon}>🏷️</div>
                                            <h3>Hiện tại không có voucher vận chuyển nào khả dụng</h3>
                                            <p>Vui lòng quay lại sau để nhận ưu đãi mới hoặc kiểm tra các loại voucher khác</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(activeTab === "all" || activeTab === "shopeepay") && (
                                <div style={styles.sectionContainer} className="section-fade-in">
                                    <div style={styles.sectionHeader}>
                                        <div style={styles.sectionTitle}>
                                            <div style={styles.icon}>💰</div>
                                            <span>Voucher <span style={styles.titleHighlight}>ShopeePay</span></span>
                                        </div>
                                        <button
                                            style={styles.refreshButton}
                                            className="refresh-btn"
                                            onClick={refreshVouchers}
                                            onMouseEnter={(e) => {
                                                // @ts-ignore
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                // @ts-ignore
                                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(238, 77, 45, 0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                // @ts-ignore
                                                e.currentTarget.style.transform = "translateY(0)";
                                                // @ts-ignore
                                                e.currentTarget.style.boxShadow = "0 4px 6px rgba(238, 77, 45, 0.2)";
                                            }}
                                        >
                                            <span style={{ marginRight: "8px" }}>↻</span> Làm mới
                                        </button>
                                    </div>

                                    {shopeePayVouchers.length > 0 ? (
                                        <div style={styles.voucherGrid}>
                                            {shopeePayVouchers.map((voucher) => (
                                                <div key={voucher.id} className="voucher-hover">
                                                    <VoucherShopeePay
                                                        voucher={voucher}
                                                        isClaimed={isLoggedIn ? claimedVoucherIds.includes(voucher.id) : false}
                                                        refreshVouchers={refreshVouchers}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={styles.emptyMessage}>
                                            <div style={styles.emptyIcon}>🏷️</div>
                                            <h3>Hiện tại không có voucher ShopeePay nào khả dụng</h3>
                                            <p>Vui lòng quay lại sau để nhận ưu đãi mới hoặc kiểm tra các loại voucher khác</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoucherPage;