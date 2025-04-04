import React from 'react';
import { useEffect, useState } from "react";
import orderService from "../services/order.service";
import { toast } from "react-toastify";

type Address = {
    profileId: string,
    fullName: string,
    phoneNumber: string,
    city: string,
    district: string,
    ward: string,
    detailAddress: string,
    defaultAddress: boolean,
}

type FormAddressProps = {
    onClose: () => void;
    refreshAddressList: () => void;
};

const inputStyle = {
    backgroundColor: "transparent",
    border: "0px",
    outline: "none",
    color: "rgb(34, 34, 34)",
    fontSize: "0.75rem",
    height: "2.375rem",
    padding: "0.625rem",
}

const divCoverInputStyle = {
    border: "1px solid rgba(0, 0, 0, 0.14)",
    borderRadius: "0.125rem",
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 2px 0px 0px inset",
    height: "2.5rem",
    transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
    width: "100%",
}

const divFieldStyle = {
    display: "flex",
    flex: "1",
    marginBottom: "0.25rem",
    marginTop: "0.95rem",
}

const FormAddress = ({ onClose, refreshAddressList }: FormAddressProps) => {

    const [formData, setFormData] = useState<Address>({
        profileId: localStorage.getItem("profileId") || "",
        fullName: "",
        phoneNumber: "",
        city: "",
        district: "",
        ward: "",
        detailAddress: "",
        defaultAddress: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await orderService.addNewOrderInfo(formData);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                toast.success("Tạo địa chỉ mới thành công");
                refreshAddressList();
                onClose();
            } else {
                toast.error("Tạo địa chỉ mới thất bại");
            }
        } catch (error) {
            toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                boxSizing: "border-box",
                borderRadius: "0.1875rem",
                boxShadow: "rgba(0, 0, 0, 0.54) 0px 2px 4px",
                display: "flex",
                flexDirection: "column",
                padding: "1.875rem",
                width: "31.25rem",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.125rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.26)",
                }}>
                    Địa chỉ mới
                </div>

                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={divFieldStyle}>
                        {/* Họ và tên */}
                        <div style={divCoverInputStyle}>
                            <input type="text" placeholder="Họ và tên"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ width: "16px" }}></div>

                    {/* Số điện thoại */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <input type="text" placeholder="Số điện thoại"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div style={divFieldStyle}>
                        {/* Tỉnh/Thành phố */}
                        <div style={divCoverInputStyle}>
                            <input type="text" placeholder="Tỉnh/Thành phố"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Quận/Huyện */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <input type="text" placeholder="Quận/Huyện"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Phường/Xã */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <input type="text" placeholder="Phường/Xã"
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Địa chỉ cụ thể */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <input type="text" placeholder="Địa chỉ cụ thể"
                                name="detailAddress"
                                value={formData.detailAddress}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "0.5rem" }}>
                    <input type="checkbox"
                        name="defaultAddress"
                        checked={formData.defaultAddress}
                        onChange={handleChange}
                    />
                    <span style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "0.75rem" }}>Đặt làm địa chỉ mặc định</span>
                </div>

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
                            style={{
                                backgroundColor: "#fff",
                                fontSize: "0.75rem",
                                color: "#333",
                                border: "1px solid #f0f0f0",
                                borderRadius: "4px",
                                padding: "10px 20px",
                                cursor: "pointer",
                            }}
                            onClick={onClose}
                        >
                            Trở lại
                        </button>
                    </div>

                    <div>
                        <button
                            style={{
                                backgroundColor: "#ee4d2d",
                                fontSize: "0.75rem",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.625rem 1.5rem",
                                cursor: "pointer",
                            }}
                            onClick={handleSubmit}
                        >
                            Hoàn thành
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormAddress;