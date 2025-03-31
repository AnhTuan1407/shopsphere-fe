import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderInfo from "../models/orderInfo.model";
import OrderRequest from "../models/orderRequest.model";
import orderService from "../services/order.service";

const OrderPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    interface SelectedItem {
        productVariantId: number;
        quantity: number;
        price: number;
        variantPrice: number;
        productImage: string;
        productName: string;
        variantColor?: string;
        variantSize?: string;
    }

    const selectedItems: SelectedItem[] = location.state?.selectedItems || [];

    const [orderInformation, setOrderInformation] = useState<OrderInfo[]>();
    const [defaultAddress, setDefaultAddress] = useState<OrderInfo>();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const profileId = localStorage.getItem("profileId");

    let totalPrice = 0;

    useEffect(() => {
        //Lấy dữ liệu thông tin nhận hàng
        const fetchOrderInformation = async () => {
            try {
                const response = await orderService.getAllOrderInfo(profileId!);

                if (response.code === 1000) {
                    const orderInfoList = response.result as OrderInfo[];
                    setOrderInformation(orderInfoList);

                    const defaultAddress = orderInfoList.find((item) => item.defaultAddress === true);
                    if (defaultAddress) {
                        setDefaultAddress(defaultAddress as OrderInfo);
                    }
                } else {
                    toast.error(`Có lỗi xảy ra: ${response.message}`);
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`)
            } finally {
                setLoading(false);
            }
        }

        fetchOrderInformation();
    }, [])

    const handleOpenPopup = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    // Chọn địa chỉ nhận hàng mặc định
    const handleSetDefaultAddress = (selectedInfo: OrderInfo) => {
        const updatedOrderInformation = (orderInformation ?? []).map((info) => ({
            ...info,
            defaultAddress: info.id === selectedInfo.id,
        }));
        setOrderInformation(updatedOrderInformation);
    };
    useEffect(() => {
        const defaultAddress = (orderInformation ?? []).find((item) => item.defaultAddress === true);
        if (defaultAddress) {
            setDefaultAddress(defaultAddress as OrderInfo);
        }
    }, [orderInformation]);

    // Đặt hàng
    const handleOrder = async (request: OrderRequest) => {
        try {
            const response = await orderService.createOrder(request);
            if (response.code == 1000) {
                toast.success("Đặt hàng thành công");
                navigate("/");
            }
            else
                toast.error(`Có lỗi xảy ra: ${response.message}`);
        } catch (error) {
            toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

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
                width: "960px",
                margin: "0 auto",
            }}>
                {/* Địa chỉ nhận hàng */}
                <div style={{ backgroundColor: "#fff", }}>
                    <div style={{
                        marginTop: "10px",
                        backgroundImage: "repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)",
                        backgroundPositionX: "-30px",
                        backgroundSize: "7.25rem 0.1875rem",
                        height: "0.1875rem",
                        width: "100%",
                    }}>
                    </div>

                    <div style={{
                        padding: "28px 30px 24px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" color="#ee4d2d" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>
                            </div>
                            <div style={{
                                fontSize: "1rem",
                                color: "#ee4d2d",
                                fontWeight: "500",
                                marginLeft: "10px",
                            }}>
                                Địa chỉ nhận hàng
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "10px",
                        }}>
                            <div style={{
                                fontWeight: "500",
                                marginRight: "10px",
                                fontSize: "0.875rem",
                            }}>
                                {defaultAddress?.fullName + " "} {defaultAddress?.phoneNumber}
                            </div>

                            <div style={{
                                marginRight: "10px",
                                fontSize: "0.825rem",
                            }}>
                                {defaultAddress?.detailAddress + ", " +
                                    "Phường " + defaultAddress?.ward + ", " +
                                    "Quận " + defaultAddress?.district + ", " +
                                    defaultAddress?.city}
                            </div>

                            <div style={{
                                marginRight: "2rem",
                                fontSize: "0.625rem",
                                color: "#ee4d2d",
                                border: "1px solid #ee4d2d",
                                padding: "2px 5px",
                            }}>
                                Mặc định
                            </div>

                            <div style={{
                                marginRight: "10px",
                            }}>
                                <div style={{
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                    color: "#05a",
                                }}
                                    onClick={handleOpenPopup}
                                >
                                    Thay đổi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Đơn hàng */}
                <div style={{
                    backgroundColor: "#fff",
                    marginTop: "10px",
                    padding: "24px 30px 16px 30px",
                }}>

                    {/* Tiêu đề */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <div style={{
                            display: "flex",
                            color: "#222",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            flex: "4",
                            height: "2.5rem",
                        }}>
                            Sản phẩm
                        </div>
                        <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#999" }}>

                        </div>
                        <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#999" }}>
                            Đơn giá
                        </div>
                        <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#999" }}>
                            Số lượng
                        </div>
                        <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#999" }}>
                            Thành tiền
                        </div>
                    </div>

                    {/* Nhà cung cấp */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        height: "2.5rem",
                    }}>
                        <div style={{
                            color: "#fff",
                            backgroundColor: "#ee4d2d",
                            padding: "0.075rem 0.1875rem",
                            fontSize: "0.625rem",
                            fontWeight: "500",
                            borderRadius: "2px",
                            marginRight: "0.5rem",
                        }}>
                            Yêu thích+
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#222", marginRight: "0.5rem", borderRight: "1px solid #999", paddingRight: "0.5rem" }}>
                            XSmart Store
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ marginRight: "0.5rem", top: "0.1875rem", position: "relative" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" color="#00BFA5" width="14" height="14" fill="currentColor" className="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
                                </svg>
                            </div>
                            <div style={{ color: "#00BFA5", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer" }}>
                                Chat ngay
                            </div>
                        </div>
                    </div>

                    {/* Sản phẩm */}
                    <div>
                        {selectedItems.map((item: any, index: number) => (
                            <div key={index} style={{
                                display: "flex",
                                alignItems: "center",
                                height: "2.5rem",
                                marginTop: "10px",
                                justifyContent: "space-between",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "10px",
                            }}>
                                <div style={{ flex: "4", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                                    <img src={item.productImage} alt="product-img" style={{ width: "2.5rem", height: "2.5rem", marginRight: "10px" }} />
                                    <div style={{
                                        fontSize: "0.75rem",
                                        color: "#222",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "250px",
                                    }}>
                                        {item.productName}
                                    </div>
                                </div>

                                <div style={{
                                    marginLeft: "10px",
                                    fontSize: "0.75rem",
                                    display: "flex",
                                    flex: "2",
                                    justifyContent: "flex-start",
                                    color: "#999",
                                }}>
                                    {item.variantColor ? item.variantColor : item.variantSize}
                                </div>

                                <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#222" }}>
                                    ₫{item.price.toLocaleString("vi-VN")}
                                </div>

                                <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#222" }}>
                                    {item.quantity}
                                </div>

                                <div style={{ display: "flex", flex: "2", justifyContent: "flex-end", fontSize: "0.75rem", color: "#222" }}>
                                    ₫{(item.quantity * item.price).toLocaleString("vi-VN")} <span hidden>{totalPrice += item.quantity * item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Xác nhận đơn hàng */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                    backgroundColor: "#fff",
                    paddingLeft: "1.875rem",
                    paddingRight: "1.875rem",
                    borderBottom: "1px solid #f1f0ed",
                }}>
                    <div style={{
                        flex: "4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        height: "5.25rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                    }}>
                        Phương thức thanh toán
                    </div>
                    <div style={{
                        flex: "2",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                    }}>
                        <div style={{
                            display: "flex",
                            flex: "2",
                        }}>
                            Thanh toán khi nhận hàng
                        </div>
                        <div style={{
                            marginLeft: "10px",
                            display: "flex",
                            flex: "1",
                            fontWeight: "500",
                            color: "#05a",
                        }}>
                            <a href="#">THAY ĐỔI</a>
                        </div>
                    </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                    display: "grid",
                    gridTemplateColumns: "1fr max-content max-content",
                    gridTemplateRows: "auto",
                    paddingTop: "0.975rem",
                    gridColumnGap: "0.875rem",
                }}>
                    <h3 style={{
                        gridColumnStart: "2",
                        gridColumnEnd: "3",
                        color: "rgba(0, 0, 0, .54)",
                        fontSize: "0.75rem",
                        fontWeight: "400"
                    }}>
                        Tổng tiền hàng
                    </h3>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        justifyContent: "flex-end",
                        padding: "0 1.6rem 0 0.625rem"
                    }}>
                        ₫ {totalPrice.toLocaleString("vi-VN")}
                    </div>
                    <h3 style={{ gridColumnStart: "2", gridColumnEnd: "3", color: "rgba(0, 0, 0, .54)", fontSize: "0.75rem", fontWeight: "400" }}>Tổng tiền phí vận chuyển</h3>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        justifyContent: "flex-end",
                        padding: "0 1.6rem 0 0.625rem"
                    }}>
                        ₫25.000
                    </div>
                    <h3 style={{ gridColumnStart: "2", gridColumnEnd: "3", color: "rgba(0, 0, 0, .54)", fontSize: "0.75rem", fontWeight: "400" }}>Tổng cộng voucher giảm giá</h3>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        justifyContent: "flex-end",
                        padding: "0 1.6rem 0 0.625rem",
                        color: "#ee4d2d",
                    }}>
                        -₫0
                    </div>
                    <h3 style={{ gridColumnStart: "2", gridColumnEnd: "3", color: "rgba(0, 0, 0, .54)", fontSize: "0.75rem", fontWeight: "400" }}>Tổng thanh toán</h3>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1.5rem",
                        justifyContent: "flex-end",
                        padding: "0 1.6rem 0 0.625rem",
                        color: "#ee4d2d"
                    }}>
                        <span style={{ fontSize: "1rem", }}>₫</span> {(totalPrice + 25000).toLocaleString("vi-VN")}
                    </div>
                    <h3 style={{ gridColumnStart: "3", gridColumnEnd: "3", color: "rgba(0, 0, 0, .54)", fontSize: "0.75rem", fontWeight: "400" }}>Đã bao gồm thuế</h3>
                </div>

                <div style={{
                    backgroundColor: "#fff",
                    gridColumnStart: "1",
                    gridColumnEnd: "4",
                    display: "flex",
                    borderTop: "1px dashed rgba(0, 0, 0, .09)",
                    minHeight: "5.975rem",
                    padding: "0 1.875rem",
                }}>
                    <div style={{ flex: "1" }}></div>

                    <div style={{
                        backgroundColor: "#ee4d2d",
                        color: "#fff",
                        border: "1px solid rgba(0,0,0,.09)",
                        borderRadius: "2px",
                        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .03)",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.425rem 3.25rem",
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                    }}
                        onClick={() => {
                            const orderRequest: OrderRequest = {
                                profileId: profileId!,
                                orderInfoId: defaultAddress?.id!,
                                products: selectedItems.map(item => ({
                                    productVariantId: item.productVariantId,
                                    quantity: item.quantity,
                                    pricePerUnit: item.variantPrice,
                                    price: item.price,
                                    variantPrice: item.variantPrice,
                                    productImage: item.productImage,
                                    productName: item.productName
                                })),
                            };
                            handleOrder(orderRequest);
                        }}
                    >
                        Đặt hàng
                    </div>
                </div>
            </div >

            {/* Popup thông tin nhận hàng */}
            {isPopupVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "1000",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "0.1875rem",
                            padding: "20px",
                            width: "400px",
                            maxHeight: "80%",
                            overflowY: "auto",
                        }}
                    >
                        <div style={{ marginBottom: "10px", paddingBottom: "10px", textAlign: "left", borderBottom: "1px solid #f0f0f0" }}>Địa chỉ của tôi</div>
                        <ul style={{ listStyle: "none", padding: "0" }}>
                            {orderInformation?.map((info) => (
                                <div style={{ display: "flex" }}>
                                    <div style={{ paddingTop: "10px" }}>
                                        <input
                                            type="radio"
                                            style={{ accentColor: "#ee4d2d" }}
                                            checked={info.defaultAddress}
                                            onChange={() => handleSetDefaultAddress(info)}
                                        />
                                    </div>
                                    <li
                                        key={info.id}
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex" }}>
                                                <div style={{
                                                    fontWeight: "500",
                                                    paddingRight: "10px",
                                                    borderRight: "1px solid #f0f0f0"
                                                }}>
                                                    {info.fullName}
                                                </div>
                                                <div style={{ color: "#888", fontSize: "0.75rem", paddingLeft: "10px" }}>{info.phoneNumber}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "0.75rem", color: "#888" }}>
                                                {info.detailAddress}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "#888" }}>
                                            Phường {info.ward}, Quận {info.district}, {info.city}
                                        </div>
                                        {info.defaultAddress && (
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#ee4d2d",
                                                    border: "1px solid #ee4d2d",
                                                    marginTop: "5px",
                                                    padding: "1px 5px",
                                                    borderRadius: "2px",
                                                    maxWidth: "4rem"
                                                }}
                                            >
                                                Mặc định
                                            </div>
                                        )}
                                    </li>
                                    <div style={{
                                        color: "#05a",
                                        cursor: "pointer",
                                        fontSize: "0.75rem",
                                        display: "flex",
                                        paddingTop: "10px",
                                        justifyContent: "flex-end",
                                        width: "125px"
                                    }}>Chỉnh sửa</div>
                                </div>
                            ))}
                        </ul>
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end"
                            }}
                        >
                            <div style={{
                                marginRight: "10px"
                            }}>
                                <button
                                    onClick={handleClosePopup}
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#333",
                                        border: "1px solid #f0f0f0",
                                        borderRadius: "4px",
                                        padding: "10px 20px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={handleClosePopup}
                                    style={{
                                        backgroundColor: "#ee4d2d",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "10px 20px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div >
                </div >
            )}
        </>
    )
}

export default OrderPage;