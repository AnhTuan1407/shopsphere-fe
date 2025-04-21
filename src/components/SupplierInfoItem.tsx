import React from "react";

type SupplierInfoItemProps = {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
};

const SupplierInfoItem: React.FC<SupplierInfoItemProps> = ({ label, value, icon }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {icon && (
                <div style={{ marginRight: "0.5rem", display: "flex", alignItems: "center" }}>
                    {icon}
                </div>
            )}
            <div style={{ color: "#000000CC" }}>{label}:</div>
            <div style={{ marginLeft: "0.25rem", color: "#d0011b" }}>{value}</div>
        </div>
    );
};

export default SupplierInfoItem;