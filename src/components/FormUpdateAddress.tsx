import React from 'react';
import { useEffect, useState } from "react";
import orderService from "../services/order.service";
import { toast } from "react-toastify";

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

type FormUpdateAddressProps = {
    refreshAddressList: () => void;
    address: Address;
    onClose: () => void;
};

const inputStyle = {
    backgroundColor: "transparent",
    border: "0px",
    outline: "none",
    color: "rgb(34, 34, 34)",
    fontSize: "0.75rem",
    height: "2.375rem",
    padding: "0.625rem",
    width: "100%",
}

const divCoverInputStyle = {
    border: "1px solid rgba(0, 0, 0, 0.14)",
    borderRadius: "0.125rem",
    boxShadow: "rgba(0, 0, 0, 0.02) 0px 2px 0px 0px inset",
    height: "2.5rem",
    transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
    width: "100%",
    position: "relative" as "relative",
}

const divFieldStyle = {
    display: "flex",
    flex: "1",
    marginBottom: "0.25rem",
    marginTop: "0.95rem",
}

const labelStyle = {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, .4)",
    fontSize: "0.75rem",
    left: "0.625rem",
    top: "-0.55rem",
    padding: "0 0.15rem",
    position: "absolute" as "absolute",
}

const FormUpdateAddress = ({ refreshAddressList, address, onClose }: FormUpdateAddressProps) => {
    const [formData, setFormData] = useState<Address>(address);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await orderService.updateOrderInfo(formData.id, formData);
            if (response.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                toast.success("Cập nhật địa chỉ thành công");
                refreshAddressList();
                onClose();
            } else {
                toast.error("Cập nhật địa chỉ thất bại");
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
                    Cập nhật địa chỉ
                </div>

                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={divFieldStyle}>
                        {/* Họ và tên */}
                        <div style={divCoverInputStyle}>
                            <div style={labelStyle}>
                                Họ và tên
                            </div>
                            <input type="text" placeholder="Họ và tên"
                                onChange={handleChange}
                                name="fullName"
                                style={inputStyle}
                                value={formData.fullName}
                            />
                        </div>
                    </div>

                    <div style={{ width: "16px" }}></div>

                    {/* Số điện thoại */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <div style={labelStyle}>
                                Số điện thoại
                            </div>
                            <input type="text" placeholder="Số điện thoại"
                                onChange={handleChange}
                                name="phoneNumber"
                                style={inputStyle}
                                value={formData.phoneNumber}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div style={divFieldStyle}>
                        {/* Tỉnh/Thành phố */}
                        <div style={divCoverInputStyle}>
                            <div style={labelStyle}>
                                Tỉnh/Thành phố
                            </div>
                            <input type="text" placeholder="Tỉnh/Thành phố"
                                onChange={handleChange}
                                name="city"
                                style={inputStyle}
                                value={formData.city}
                            />
                        </div>
                    </div>

                    {/* Quận/Huyện */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <div style={labelStyle}>
                                Quận/Huyện
                            </div>
                            <input type="text" placeholder="Quận/Huyện"
                                onChange={handleChange}
                                name="district"
                                style={inputStyle}
                                value={formData.district}
                            />
                        </div>
                    </div>

                    {/* Phường/Xã */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <div style={labelStyle}>
                                Phường/Xã
                            </div>
                            <input type="text" placeholder="Phường/Xã"
                                onChange={handleChange}
                                name="ward"
                                style={inputStyle}
                                value={formData.ward}
                            />
                        </div>
                    </div>

                    {/* Địa chỉ cụ thể */}
                    <div style={divFieldStyle}>
                        <div style={divCoverInputStyle}>
                            <div style={labelStyle}>
                                Địa chỉ cụ thể
                            </div>
                            <input type="text" placeholder="Địa chỉ cụ thể"
                                onChange={handleChange}
                                name="detailAddress"
                                style={inputStyle}
                                value={formData.detailAddress}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "0.5rem" }}>
                    <input type="checkbox"
                        onChange={handleChange}
                        name="defaultAddress"
                        checked={formData.defaultAddress}
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

export default FormUpdateAddress;