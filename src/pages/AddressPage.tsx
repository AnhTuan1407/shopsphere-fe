import { useEffect, useState } from "react";
import CardAddress from "../components/CardAddress";
import FormAddress from "../components/FormAddress";
import orderService from "../services/order.service";

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
}

const AddressPage = () => {
    const [address, setAddress] = useState<Address[]>([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const fetchAddress = async () => {
        const profileId = localStorage.getItem("profileId");
        try {
            const response = await orderService.getAllOrderInfoByProfileId(profileId!);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                const sortedAddresses = (response.result as Address[]).sort((a, b) => {
                    if (a.defaultAddress && !b.defaultAddress) return -1;
                    if (!a.defaultAddress && b.defaultAddress) return 1;
                    return 0;
                });
                setAddress(sortedAddresses);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    const handleOpenPopup = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <>
            <div style={{ backgroundColor: "#fff", boxSizing: "border-box" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1.125rem 1.875rem",
                    borderBottom: "1px solid rgb(239, 239, 239)",
                    boxSizing: "border-box",
                }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#555", flex: "1" }}>Địa chỉ của tôi</div>
                    <div
                        style={{
                            cursor: "pointer",
                            backgroundColor: "#ee4d2d",
                            color: "#fff",
                            padding: "0.25rem 1rem 0.25rem 0.75rem",
                            fontSize: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                        onClick={handleOpenPopup}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                        <span style={{ fontSize: "0.75rem" }}>Thêm địa chỉ mới</span>
                    </div>
                </div>

                {/* Danh sách địa chỉ */}
                <div style={{
                    padding: "0.75rem 1.875rem 0",
                }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#555", }}>Địa chỉ</div>

                    {address.map((item, index) => (
                        <CardAddress
                            key={index}
                            id={item.id}
                            profileId={item.profileId}
                            fullName={item.fullName}
                            phoneNumber={item.phoneNumber}
                            city={item.city}
                            district={item.district}
                            ward={item.ward}
                            detailAddress={item.detailAddress}
                            defaultAddress={item.defaultAddress}
                            refreshAddressList={fetchAddress}
                        />
                    ))}
                </div>
            </div>

            {/* Hiển thị popup FormAddress */}
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
                    <FormAddress refreshAddressList={fetchAddress} onClose={handleClosePopup} />
                </div>
            )}
        </>
    );
};

export default AddressPage;