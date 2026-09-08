import api from "./api";

export async function login(email, password) {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
}

export async function getMe() {
    const response = await api.get("/auth/me");

    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}