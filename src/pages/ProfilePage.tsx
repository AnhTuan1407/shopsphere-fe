import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import profileService from "../services/profile.service";
import avatar from "../assets/loppy.jpg";

const styleLabel = {
    display: "flex",
    color: "rgba(85, 85, 85, .8)",
    overflow: "hidden",
    paddingBottom: "1.875rem",
    whiteSpace: "nowrap",
    minWidth: "20%",
    justifyContent: "flex-end"
}

const styleField = {
    boxSizing: "border-box" as const,
    paddingBottom: "1.875rem",
    paddingLeft: "1.25rem",
    width: "450px"
}

type Profile = {
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
}

type User = {
    id: string,
    username: string,
    password: string,
}

const ProfilePage = () => {

    const [user, setUser] = useState<User>();
    const [profile, setProfile] = useState<Profile>();
    const [token, setToken] = useState<string>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const profileId = localStorage.getItem("profileId");
        setToken(token!);
        const fetchUser = async () => {
            try {
                const userResponse = await profileService.getMyInfo(token!);
                if (userResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    setUser(userResponse.result as User);
                } else {
                    toast.error(`Có lỗi xảy ra`);
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        const fetchProfile = async () => {
            try {
                if (!profileId) {
                    toast.error("Không tìm thấy Profile ID trong localStorage");
                    return;
                }

                const profileResponse = await profileService.getProfileById(profileId);

                if (profileResponse.code === Number(process.env.REACT_APP_CODE_SUCCESS)) {
                    setProfile(profileResponse.result as Profile);
                } else {
                    toast.error(`Có lỗi xảy ra khi lấy thông tin hồ sơ`);
                }
            } catch (error) {
                toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        fetchUser();
        fetchProfile();
    }, []);

    return (
        <>
            <div style={{
                padding: "0 1.875rem .625rem",
                backgroundColor: "#fff",
            }}>
                <div style={{
                    padding: "1.125rem 0",
                    borderBottom: ".0625rem solid #efefef",
                }}>
                    <div style={{ fontSize: "1.125rem", color: "#333", fontWeight: "500", lineHeight: "1.5rem" }}>Hồ Sơ Của Tôi</div>
                    <div style={{ fontSize: "0.875rem", color: "#555", lineHeight: "1.0625rem", marginTop: "0.1875rem" }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
                </div>

                <div style={{
                    paddingTop: "1.875rem",
                    display: "flex",
                    alignItems: "center"
                }}>
                    {/* Information */}
                    <div style={{
                        flex: "1",
                        paddingRight: "3.125rem",
                    }}>
                        {/* Username */}
                        <div style={{ display: "flex", }}>
                            <div style={styleLabel}>
                                Tên đăng nhập
                            </div>
                            <div style={styleField}>
                                {user?.username}
                            </div>
                        </div>

                        {/* Name */}
                        <div style={{ display: "flex", }}>
                            <div style={styleLabel}>
                                Tên
                            </div>
                            <div style={styleField}>
                                {profile?.firstName} {profile?.lastName}
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ display: "flex", }}>
                            <div style={styleLabel}>
                                Email
                            </div>
                            <div style={styleField}>
                                {profile?.email}
                            </div>
                        </div>

                        {/* Phone number */}
                        <div style={{ display: "flex", }}>
                            <div style={styleLabel}>
                                Số diện thoại
                            </div>
                            <div style={styleField}>
                                {profile?.phoneNumber}
                            </div>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div style={{
                        display: "flex",
                        flex: "1",
                        width: "17.5rem",
                        justifyContent: "center",
                        alignItems: "center",
                        borderLeft: ".0625rem solid #efefef",
                    }}>
                        <div style={{ flexDirection: "column", display: "flex", alignItems: "center" }}>
                            <img src={avatar} alt="avatar" style={{
                                borderRadius: "50%",
                                width: "6.25rem",
                                height: "6.25rem",
                                margin: "1.25rem 0",
                            }} />

                            <div style={{
                                flexDirection: "column",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <div style={{
                                    backgroundColor: "#fff",
                                    border: "1px solid rgba(0, 0, 0, .09)",
                                    color: "#555",
                                    padding: "0.625rem 1rem",
                                    cursor: "pointer",
                                    maxWidth: "6.25rem",
                                    textAlign: "center",
                                    marginBottom: "0.625rem"
                                }}>
                                    Chọn ảnh
                                </div>

                                <div style={{
                                    fontSize: "0.75rem",
                                    color: "#9999"
                                }}>
                                    Dụng lượng file tối đa 1 MB
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;