import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import shopeeWhiteLogo from "../assets/shopee-white-logo.png";
import SearchField from "../components/SearchField";
import { useCart } from "../contexts/CartContext";
import authenticationService from "../services/authentication.service";
import cartService from "../services/cart.service";


const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
    transition: "color 0.3s",
};

const HeaderLayout = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { cartItemCount, setCartItemCount } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const profileId = localStorage.getItem("profileId");

        if (token) {
            const introspectToken = async () => {
                const response = await authenticationService.introspect(token);

                if (!(response?.result as { valid: boolean })?.valid) {
                    localStorage.clear();
                    setUsername(null);
                    setProfileId(null);
                    toast.error("Hết hạn phiên đăng nhập, vui lòng đăng nhập lại");
                    navigate("/");
                }
            }

            introspectToken();
        }

        setUserId(userId);
        setToken(token);
        setProfileId(profileId);

        const storedUsername = localStorage.getItem("username");
        if (token && storedUsername) {
            setUsername(storedUsername);
        }

    }, [navigate]);

    useEffect(() => {
        if (profileId) {
            const fetchCart = async () => {
                const cartResponse = await cartService.getCartByProfileId(profileId);
                if (cartResponse?.result) {
                    const cart = cartResponse.result as { cartItems: { length: number }[] };
                    setCartItemCount(cart.cartItems.length);
                }
            }
            fetchCart();
        } else {
            setCartItemCount(0);
        }
    }, [profileId]);

    const handleLogout = async () => {
        const response = await authenticationService.logout(token ?? "");
        if (response.code == 1000) {
            localStorage.clear();
            setUsername(null);
            setProfileId(null);
            toast.success("Đăng xuất thành công");
            navigate("/");
        }
        else {
            toast.error("Đăng xuất không thành công: " + response.message);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

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
                        <SearchField placeholder="Tìm tên sản phẩm, thương hiệu, và tên shop" width="100%" height="2.25rem" />
                        <div style={{
                            marginTop: "0.5rem",
                        }}>
                            <ul style={{
                                listStyle: "none",
                                display: "flex",
                                gap: "1rem",
                                color: "#fff",
                                fontSize: "10px",
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

                    {/* Cart and Auth Buttons */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}>
                        {/* Cart */}
                        <div style={{ position: "relative", cursor: "pointer" }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36px"
                                height="36px"
                                color="#fff"
                                fill="currentColor"
                                className="bi bi-cart3"
                                viewBox="0 0 16 16"
                                onClick={() => navigate(`/cart/${profileId}`)}
                            >
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                            {cartItemCount > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-5px",
                                        right: "-5px",
                                        backgroundColor: "#fff",
                                        color: "#ee4d2d",
                                        borderRadius: "50%",
                                        border: "#ee4d2d",
                                        width: "20px",
                                        height: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: "400",
                                    }}
                                >
                                    {cartItemCount}
                                </div>
                            )}
                        </div>

                        {/* Hiển thị username hoặc nút Đăng nhập/Đăng ký */}
                        {username ? (
                            <div
                                style={{ position: "relative" }}
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                {/* Username */}
                                <div
                                    style={{
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                    }}
                                >
                                    {username}
                                </div>

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            backgroundColor: "#fff",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            borderRadius: "4px",
                                            overflow: "hidden",
                                            zIndex: 10,
                                            fontSize: "12px",
                                        }}
                                    >
                                        <ul
                                            style={{
                                                listStyle: "none",
                                                margin: 0,
                                                padding: 0,
                                            }}
                                        >
                                            <li
                                                style={{
                                                    padding: "10px 20px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #f0f0f0",
                                                    minWidth: "100px",
                                                    transition: "background-color 0.3s, color 0.3s",
                                                }}
                                                onClick={() => {
                                                    closeDropdown();
                                                    navigate(`/profile`);
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                    e.currentTarget.style.color = "#333";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#fff";
                                                    e.currentTarget.style.color = "#000";
                                                }}
                                            >
                                                Tài khoản của tôi
                                            </li>
                                            <li
                                                style={{
                                                    padding: "10px 20px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #f0f0f0",
                                                    transition: "background-color 0.3s, color 0.3s",
                                                }}
                                                onClick={() => {
                                                    closeDropdown();
                                                    navigate(`/profile/orders`);
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                    e.currentTarget.style.color = "#333";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#fff";
                                                    e.currentTarget.style.color = "#000";
                                                }}
                                            >
                                                Đơn mua
                                            </li>
                                            <li
                                                style={{
                                                    padding: "10px 20px",
                                                    cursor: "pointer",
                                                    color: "#ee4d2d",
                                                    transition: "background-color 0.3s, color 0.3s",
                                                }}
                                                onClick={() => {
                                                    closeDropdown();
                                                    handleLogout();
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                    e.currentTarget.style.color = "#d43720";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#fff";
                                                    e.currentTarget.style.color = "#ee4d2d";
                                                }}
                                            >
                                                Đăng xuất
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Đăng ký */}
                                <button
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#ee4d2d",
                                        border: "1px solid #ee4d2d",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s, color 0.3s",
                                    }}
                                    onClick={() => navigate("/auth/sign-up")}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgb(255 200 186)";
                                        e.currentTarget.style.color = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#fff";
                                        e.currentTarget.style.color = "#ee4d2d";
                                    }}
                                >
                                    Đăng ký
                                </button>

                                {/* Đăng nhập */}
                                <button
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#ee4d2d",
                                        border: "1px solid #ee4d2d",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s, color 0.3s",
                                    }}
                                    onClick={() => navigate("/auth/sign-in")}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgb(255 200 186)";
                                        e.currentTarget.style.color = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#fff";
                                        e.currentTarget.style.color = "#ee4d2d";
                                    }}
                                >
                                    Đăng nhập
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderLayout;