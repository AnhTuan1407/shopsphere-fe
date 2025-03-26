import api from "./api";
import { User } from "../models/user.model";
import AuthRequest from "../models/authRequest.model";
import AuthResponse from "../models/authResponse.model";
import ApiResponse from "../models/apiResponse.model";

const authenticationService = {
    register: async (data: User): Promise<User> => {
        const response = await api.post("/identity/users/registration", data);
        return response.data.result;
    },
    login: async (data: AuthRequest): Promise<AuthResponse> => {
        const response = await api.post("/identity/auth/token", data);
        return response.data.result;
    },
    logout: async (data: string): Promise<ApiResponse> => {
        const response = await api.post("/identity/auth/logout", data);
        return response.data;
    }
};

export default authenticationService;