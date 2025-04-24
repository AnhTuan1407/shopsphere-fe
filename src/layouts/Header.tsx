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

const HeaderLayout = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { cartItemCount, setCartItemCount } = useCart();

    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        if (keyword.trim() !== '') {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    }
    
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
                    return;
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

    const handleCart = () => {
        const token = localStorage.getItem("token");
        const profileId = localStorage.getItem("profileId");
        if (!token || !profileId) {
            toast.error("Vui lòng đăng nhập để xem giỏ hàng.");
            navigate("/sign-in");
            return;
        }

        navigate(`/cart/${profileId}`);
    }

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
                height: "6.5rem",
                display: "flex",
                alignItems: "center",
                paddingBottom: "0.625rem"
            }}>
                <div style={{
                    width: "1200px",
                    margin: "0 auto",
                    paddingBottom: "10px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "10px"
                    }}>

                        {/* Nav - 1 */}
                        <div style={{
                            display: "flex",
                            fontSize: "0.75rem",
                            marginLeft: "1rem",
                        }}>
                            <div style={{
                                padding: "0.25rem",
                                borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                            }}>
                                <a href="/seller" style={{ color: "#fff" }}>Kênh người bán</a>
                                <div style={{ marginLeft: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shop" viewBox="0 0 16 16">
                                        <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{
                                padding: "0.25rem",
                                borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                            }}>
                                <a href="#" style={{ color: "#fff" }}>Tải ứng dụng</a>
                                <div style={{ marginLeft: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code-scan" viewBox="0 0 16 16">
                                        <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z" />
                                        <path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z" />
                                        <path d="M7 9H2v5h5zm-4 1h3v3H3zm8-6h1v1h-1z" />
                                        <path d="M9 2h5v5H9zm1 1v3h3V3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8zm2 2H9V9h1zm4 2h-1v1h-2v1h3zm-4 2v-1H8v1z" />
                                        <path d="M12 9h2V8h-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{
                                padding: "0.25rem",
                                borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                            }}>
                                <a href="#" style={{ color: "#fff" }}>Kết nối</a>
                                <div style={{ marginLeft: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                    </svg>
                                </div>
                                <div style={{ marginLeft: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            fontSize: "0.75rem",
                            marginLeft: "1rem",
                        }}>
                            <div style={{
                                padding: "0.25rem",
                                borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                            }}>
                                <div style={{ marginRight: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                                    </svg>
                                </div>
                                <a href="#" style={{ color: "#fff" }}>Thông báo</a>
                            </div>
                            <div style={{
                                padding: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff",
                                borderRight: "1px solid hsla(0, 0%, 100%, .22)",
                            }}>
                                <div style={{ marginRight: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                                    </svg>
                                </div>
                                <a href="#" style={{ color: "#fff" }}>Hỗ trợ</a>
                            </div>
                            <div style={{
                                padding: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                                color: "#fff"
                            }}>
                                <div style={{ marginRight: "5px", paddingTop: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe2" viewBox="0 0 16 16">
                                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                                    </svg>
                                </div>
                                <a href="#" style={{ color: "#fff" }}>Tiếng Việt</a>
                            </div>
                        </div>
                    </div>
                    <div style={{
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
                            <SearchField
                                value={keyword}
                                onChange={setKeyword}
                                placeholder="Tìm tên sản phẩm..."
                                width="100%"
                                height="2.25rem"
                                onSearch={handleSearch}
                            />
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
                                    onClick={handleCart}
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
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}>
                                        <img src={avatar} alt="avatar" style={{
                                            borderRadius: "50%",
                                            width: "2rem",
                                            height: "2rem",
                                            objectFit: "cover",
                                            border: "1px solid #fff",
                                        }} />
                                        <div
                                            style={{
                                                color: "#fff",
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
            </div>
        </>
    );
};

export default HeaderLayout;