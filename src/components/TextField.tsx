import React, { forwardRef } from "react";

type Props = {
    width?: string;
    padding?: string;
    placeholder?: string;
    type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>; // Kế thừa tất cả các thuộc tính của thẻ <input>

const TextField = forwardRef<HTMLInputElement, Props>(
    ({ width = "100%", padding = "0.5rem", placeholder, type = "text", ...rest }, ref) => {
        return (
            <input
                ref={ref} // Đảm bảo ref được truyền từ react-hook-form
                type={type}
                placeholder={placeholder}
                style={{
                    width: width,
                    padding: padding,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
                {...rest}
            />
        );
    }
);

export default TextField;