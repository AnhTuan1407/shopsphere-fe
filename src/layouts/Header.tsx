import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import shopeeWhiteLogo from "../assets/shopee-white-logo.png";
import SearchField from "../components/SearchField";
import authenticationService from "../services/authentication.service";
import profileService from "../services/profile.service";
import Profile from "../models/profile.model";


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

    // Kiểm tra token trong localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        setUserId(userId);
        setToken(token);
        const storedUsername = localStorage.getItem("username");
        if (token && storedUsername) {
            setUsername(storedUsername);
        }

        const fetchProfile = async () => {
            const profileResponse = await profileService.getProfileByUserId(userId!);
            if (profileResponse?.result) {
                const profile: Profile = profileResponse.result;
                if (profile.id) {
                    localStorage.setItem("profileId", profile.id);
                    setProfileId(profile.id);
                } else {
                    console.error("Profile ID is undefined");
                }
            } else {
                console.error("Profile not found or invalid response");
            }
        }

        fetchProfile()
    }, []);

    const handleLogout = async () => {
        const response = await authenticationService.logout(token ?? "");
        if (response.code) {
            localStorage.clear();
            setUsername(null);
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
                        <div style={{
                            color: "#fff",
                            fontSize: "30px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="36px"
                                height="36px"
                                fill="currentColor"
                                className="bi bi-cart3"
                                viewBox="0 0 16 16"
                                onClick={() => navigate(`/cart/${profileId}`)}>
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
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
                                                    navigate(`/profile/${profileId}`);
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
                                                    navigate(`/orders/${profileId}`);
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
                                    onClick={() => navigate("/sign-up")}
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
                                    onClick={() => navigate("/sign-in")}
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