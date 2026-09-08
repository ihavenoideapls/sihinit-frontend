import api from "./api";

export async function getCases(page = 1, limit = 10) {
    const response = await api.get("/cases", {
        params: {
            page,
            limit,
        },
    });

    return response.data;
}

export async function createCase(title, description) {
    const response = await api.post("/cases", {
        title,
        description,
    });

    return response.data;
}