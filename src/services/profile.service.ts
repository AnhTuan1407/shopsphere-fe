import ApiResponse from "../models/apiResponse.model";
import api from "./api";

const profileService = {
    getProfileByUserId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get("/profile/user/" + id);
        return response.data;
    }
}

export default profileService;