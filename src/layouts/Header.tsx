import { FaSearch, FaShoppingCart } from "react-icons/fa";
import shopeeWhiteLogo from "../assets/shopee-white-logo.png";
import searchIcon from "../assets/search-icon.jpg";

const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
    transition: "color 0.3s",
};

const HeaderLayout = () => {
    return (
        <>
            <div style={{
                backgroundColor: "#ee4d2d",
                boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                height: "5.3125rem",
                display: "flex",
                alignItems: "center",
            }}>
                <div style={{
                    width: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    {/* Logo */}
                    <div>
                        <a href="/">
                            <img src={shopeeWhiteLogo} alt="shopee-logo" style={{
                                height: "4rem",
                                width: "10.5rem",
                                objectFit: "contain",
                            }} />
                        </a>
                    </div>

                    {/* Search Bar */}
                    <div style={{
                        flex: 0.8,
                        marginLeft: "1rem",
                        marginRight: "1rem",
                    }}>
                        <form style={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "2px",
                            backgroundColor: "#fff",
                            height: "2.5rem",
                            padding: "0.1875rem",
                            boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                        }}>
                            <input
                                placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                                style={{
                                    flex: 1,
                                    border: "none",
                                    outline: "none",
                                    padding: "0.5rem",
                                    fontSize: "14px",
                                }}
                            />
                            <button style={{
                                backgroundColor: "#ee4d2d",
                                color: "#fff",
                                border: "none",
                                padding: "0 1rem",
                                cursor: "pointer",
                                fontSize: "14px",
                                height: "100%",
                                borderRadius: "2px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                            }}>
                                {/* <FaSearch /> */}
                            </button>
                        </form>
                        <div style={{
                            marginTop: "0.5rem",
                        }}>
                            <ul style={{
                                listStyle: "none",
                                display: "flex",
                                gap: "1rem",
                                color: "#fff",
                                fontSize: "11px",
                                padding: "0",
                                margin: "0",
                            }}>
                                <li>
                                    <a href="" style={linkStyle}>Áo BabyTee</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Dép nam</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Bánh tráng phơi sương</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Áo khoác</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Gấu bông</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Quần jean ống rộng</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Kẹp tóc</a>
                                </li>
                                <li>
                                    <a href="" style={linkStyle}>Ốp lưng iphone</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Cart */}
                    <div style={{
                        color: "#fff",
                        fontSize: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        {/* <FaShoppingCart /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderLayout;