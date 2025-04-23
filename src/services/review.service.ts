import ApiResponse from "../models/apiResponse.model";
import ReviewRequest from "../models/review.request";
import api from "./api";

const token = localStorage.getItem("token");

const reviewService = {

    createReview: async (request: any): Promise<ApiResponse> => {
        const response = await api.post("/reviews/", request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },
    getAllReviewsByProductId: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/reviews/by-product/${id}`);
        return response.data;
    },

    filterReviewByRating: async (rating: number): Promise<ApiResponse> => {
        const response = await api.get(`/reviews/filter/${rating}`);
        return response.data;
    },

    likeReview: async (idReview: number, profileId: string): Promise<ApiResponse> => {
        const response = await api.put(`/reviews/like/${idReview}`, { profileId }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },

    getLikeCountReview: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/reviews/like-count/${id}`);
        return response.data;
    },

    isLike: async (idReview: number, profileId: string): Promise<ApiResponse> => {
        const response = await api.get(`/reviews/isLike/${idReview}?profileId=${profileId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },
}

export default reviewService;