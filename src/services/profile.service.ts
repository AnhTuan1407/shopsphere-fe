import ApiResponse from "../models/apiResponse.model";
import api from "./api";

const token = localStorage.getItem("token");

const profileService = {

    getProfileByUserId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get("/profile/user/" + id,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },
    getMyInfo: async (token: string): Promise<ApiResponse> => {
        const response = await api.get("/identity/users/my-info",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        return response.data;
    },

    getProfileById: async (id: string): Promise<ApiResponse> => {
        const response = await api.get("/profile/" + id, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },
}

export default profileService;