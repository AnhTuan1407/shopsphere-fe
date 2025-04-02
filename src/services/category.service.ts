import api from "./api";
import Category from "../models/category.model";

const categoryService = {
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get("/categories");
        return response.data.result;
    },
};

export default categoryService;
