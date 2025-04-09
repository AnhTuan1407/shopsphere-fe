import api from "./api";
import Category from "../models/category.model";
import ApiResponse from "../models/apiResponse.model";

const categoryService = {
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get("/categories");
        return response.data.result;
    },

    createCategory: async (request: any): Promise<ApiResponse> => {
        const response = await api.post("/categories", request);
        return response.data;
    }
};

export default categoryService;
