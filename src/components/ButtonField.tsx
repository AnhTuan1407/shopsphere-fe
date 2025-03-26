import { IcSpinner } from "../icons/IcSpinner";
import { ReactNode } from "react";

type Props = {
    loading?: boolean,
    children?: ReactNode,
    width?: string,
    onClick?: () => void;
}

const ButtonField = ({
    loading,
    children,
    width,
    onClick
}: Props) => {
    return (
        <>
            <button style={{
                width: `${width}`,
                backgroundColor: "#ee4d2d",
                color: "#fff",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.3s",
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d43720";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ee4d2d";
                }}

                onClick={onClick && onClick}
            >
                {!loading
                    ? children
                    : <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem", color: "#fff" }}>
                        <IcSpinner width="2rem" height="2rem" />
                        {children}
                    </div>
                }
            </button>
        </>
    )
}

export default ButtonField;