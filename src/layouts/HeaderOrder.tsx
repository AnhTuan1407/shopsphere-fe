import { useNavigate } from "react-router-dom";
import shopeeLogo from "../assets/Shopee.svg";

const HeaderOrder = () => {
    const navigate = useNavigate();

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                padding: "1rem"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: "900px",
                    margin: "0 auto",
                    alignItems: "center"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>

                        {/* Logo */}
                        <div style={{
                        }}>
                            <img src={shopeeLogo} alt="shopee-logo" style={{
                                height: "2rem",
                                cursor: "pointer"
                            }} onClick={() => navigate("/")} />
                        </div>

                        {/* Title */}
                        <div style={{
                            fontSize: "1.25rem",
                            marginLeft: "10px",
                            color: "#ee4d2d",
                            borderLeft: ".0625rem solid #ee4d2d",
                            paddingLeft: ".9375rem",
                        }}>
                            Thanh toán
                        </div>
                    </div>

                    <div>
                        <a href="#" style={{
                            color: "#ee4d2d",
                            fontSize: "0.675rem",
                            fontWeight: "500"
                        }}>Bạn cần giúp đỡ?</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeaderOrder;