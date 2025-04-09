import { useLocation, useNavigate } from "react-router-dom";
import shopeeLogo from "../assets/Shopee.svg";
import { useState } from "react";

const HeaderAuth = () => {
    const location = useLocation();
    let isSignUp = false;
    if (location.pathname === "/sign-up" || location.pathname === "/seller/sign-up") {
        isSignUp = true;
    }
    else {
        isSignUp = false;
    }

    const navigate = useNavigate();

    return (
        <>
            <div style={{
                backgroundColor: "#fff",
                padding: "1rem",
                boxShadow: "0 6px 6px rgba(0, 0, 0, .06)",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: "900px",
                    margin: "0 auto",
                    alignItems: "center",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>

                        {/* Logo */}
                        <div>
                            <img src={shopeeLogo} alt="shopee-logo" style={{
                                height: "2rem",
                                cursor: "pointer"
                            }} onClick={() => navigate("/")} />
                        </div>

                        {/* Title */}
                        <div style={{
                            fontSize: "1.25rem",
                            marginLeft: "10px"
                        }}>
                            {isSignUp ? "Đăng ký" : "Đăng nhập"}
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

export default HeaderAuth;