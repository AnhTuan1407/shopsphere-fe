import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import shopeeWhiteLogo from "../assets/shopee-white-logo.png";
import SearchField from "../components/SearchField";
import { useCart } from "../contexts/CartContext";
import authenticationService from "../services/authentication.service";
import cartService from "../services/cart.service";
import avatar from "../assets/loppy.jpg";


const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
    transition: "color 0.3s",
};

const HeaderSeller = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                backgroundColor: "#fff",
                boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .05)",
                height: "5.35rem",
                width: "100%",
                margin: "0 auto",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1.5rem",
                }}>
                    <div style={{
                        display: "flex",
                        fontSize: "0.75rem",
                        marginLeft: "1rem",
                    }}>
                        <div style={{
                            padding: "0.25rem",
                            borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                        }}>
                            <a href="/seller" style={{ color: "#333" }}>Kênh người bán</a>
                        </div>
                        <div style={{
                            padding: "0.25rem",
                            borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                        }}>
                            <a href="#" style={{ color: "#333" }}>Tải ứng dụng</a>
                        </div>
                        <div style={{
                            padding: "0.25rem",
                        }}>
                            <a href="#" style={{ color: "#333" }}>Kết nối</a>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                    }}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        {/* Username */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            marginRight: "2.5rem"
                        }}>
                            <img src={avatar} alt="avatar" style={{
                                borderRadius: "50%",
                                width: "2rem",
                                height: "2rem",
                                objectFit: "cover",
                                border: "1px solid #333",
                            }} />
                            <div
                                style={{
                                    color: "#333",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                }}
                            >
                                {username}
                            </div>
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
                </div>
            </div>
        </>
    );
};

export default HeaderSeller;