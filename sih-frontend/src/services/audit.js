import api from "./api";

export async function getAudit({
    document_id,
    user_id,
    date_from,
    date_to,
    page = 1,
    limit = 20,
} = {}) {

    const response = await api.get("/audit", {
        params: {
            document_id,
            user_id,
            date_from,
            date_to,
            page,
            limit,
        },
    });

    return response.data;
}


export async function verifyAuditChain() {
    const response = await api.get("/audit/verify");

    return response.data;
}