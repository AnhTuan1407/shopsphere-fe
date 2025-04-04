import { toast } from "react-toastify";
import orderService from "../services/order.service";
import FormUpdateAddress from "./FormUpdateAddress";
import { useState } from "react";

type Address = {
    id: number,
    profileId: string,
    fullName: string,
    phoneNumber: string,
    city: string,
    district: string,
    ward: string,
    detailAddress: string,
    defaultAddress: boolean,
    refreshAddressList: () => void,
}

const CardAddress = ({
    id,
    profileId,
    fullName,
    phoneNumber,
    city,
    district,
    ward,
    detailAddress,
    defaultAddress,
    refreshAddressList
}: Address) => {

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [addressData, setAddressData] = useState<Address | null>(null);

    const handleSetDefaultAddress = async () => {
        if (defaultAddress) {
            return;
        }

        try {
            const response = await orderService.setDefaultAddress(id);

            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                toast.success("Cập nhật địa chỉ mặc định thành công");
                refreshAddressList();
            } else {
                toast.error("Cập nhật địa chỉ mặc định thất bại");
            }
        } catch (error) {
            toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    const handleOpenPopup = async () => {
        try {
            const response = await orderService.getOrderInfoById(id);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                setAddressData(response.result as Address);
                setIsPopupVisible(true);
            } else {
                toast.error("Không thể lấy thông tin địa chỉ");
            }
        } catch (error) {
            toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleDeleteAddress = async () => {
        try {
            const response = await orderService.deleteOrderInfo(id);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                toast.success("Xóa địa chỉ thành công");
                refreshAddressList();
            } else {
                toast.error("Không thể xóa địa chỉ");
            }
        } catch (error) {
            toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setAddressData(null);
    };

    return (
        <>
            <div style={{
                padding: "1rem 0",
                borderBottom: "1px solid rgba(0, 0, 0, 0.09)",
                backgroundColor: "#fff",
            }}>
                {/* Thông tin cá nhân */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        flex: "1",
                    }}>
                        <div style={{
                            fontSize: "0.875rem",
                            paddingRight: "0.5rem",
                            borderRight: "0.5px solid rgba(0, 0, 0, 0.26)",
                            fontWeight: "500",
                        }}>
                            {fullName}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "rgba(0, 0, 0, 0.54)", paddingLeft: "0.5rem", }}>{phoneNumber}</div>
                    </div>

                    <div style={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: "#0088FF",
                    }}
                        onClick={handleOpenPopup}
                    >
                        Cập nhật
                    </div>

                    {
                        !defaultAddress && (
                            <div style={{
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                color: "#0088FF",
                                marginLeft: "1rem",
                            }}
                                onClick={handleDeleteAddress}
                            >
                                Xóa
                            </div>
                        )
                    }
                </div>

                {/* Địa chỉ */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                }}>
                    <div style={{
                        fontSize: "0.75rem",
                        color: "rgba(0, 0, 0, 0.54)",
                        flex: "1",
                    }}>
                        <div>{detailAddress}</div>
                        <div>Phường {ward}, Quận {district}, {city}</div>
                    </div>

                    {/* Nút "Thiết lập mặc định" */}
                    <div
                        style={{
                            cursor: defaultAddress ? "not-allowed" : "pointer",
                            backgroundColor: defaultAddress ? "#f0f0f0" : "#fff",
                            color: defaultAddress ? "rgba(0, 0, 0, 0.26)" : "#333",
                            fontSize: "0.75rem",
                            padding: "0.25rem 1rem",
                            border: "1px solid rgba(0, 0, 0, 0.09)",
                            boxShadow: "rgba(0, 0, 0, 0.03) 0px 1px 1px",
                        }}

                        onClick={handleSetDefaultAddress}
                    >
                        {defaultAddress ? "Đã là mặc định" : "Thiết lập mặc định"}
                    </div>
                </div>

                {/* Default address */}
                {defaultAddress && (
                    <div style={{
                        color: "#ee4d2d",
                        fontSize: "0.625rem",
                        fontWeight: "500",
                        padding: "0.125rem 0.25rem",
                        backgroundColor: "#fff",
                        border: "1px solid #ee4d2d",
                        borderRadius: "1px",
                        maxWidth: "3.25rem",
                    }}>
                        Mặc định
                    </div>
                )}
            </div>

            {/* Hiển thị popup FormUpdateAddress */}
            {isPopupVisible && (
                <div style={{
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
                }}>
                    {addressData && (
                        <FormUpdateAddress
                            refreshAddressList={refreshAddressList}
                            address={addressData}
                            onClose={handleClosePopup}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default CardAddress;