import api from "./api";

export async function getDocuments({
    page = 1,
    limit = 10,
    case_id,
    document_type,
    confidentiality_level,
} = {}) {

    const response = await api.get("/documents", {
        params: {
            page,
            limit,
            case_id,
            document_type,
            confidentiality_level,
        },
    });

    return response.data;
}


export async function getDocument(id) {
    const response = await api.get(`/documents/${id}`);

    return response.data;
}


export async function uploadDocument({
    file,
    case_id,
    document_type,
    confidentiality_level,
}) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("case_id", case_id);
    formData.append("document_type", document_type);
    formData.append(
        "confidentiality_level",
        confidentiality_level
    );

    const response = await api.post(
        "/documents/upload",
        formData
    );

    return response.data;
}


export async function getVersions(id) {
    const response = await api.get(
        `/documents/${id}/versions`
    );

    return response.data;
}


export async function downloadDocument(id) {

    const response = await api.get(
        `/documents/${id}/download`,
        {
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = "document";

    document.body.appendChild(link);
    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}


export async function getChainOfCustody(id) {
    const response = await api.get(
        `/documents/${id}/chain-of-custody`
    );

    return response.data;
}


export async function shareDocument(
    id,
    user_id,
    permission,
    expires_at
) {

    const response = await api.post(
        `/documents/${id}/share`,
        {
            user_id,
            permission,
            expires_at,
        }
    );

    return response.data;
}


export async function getShares(id) {
    const response = await api.get(
        `/documents/${id}/shares`
    );

    return response.data;
}