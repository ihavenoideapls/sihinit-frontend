import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <div>
            <h1>Dashboard</h1>

            {user && (
                <>
                    <h2>Welcome, {user.name}</h2>
                    <p>Role: {user.role}</p>
                </>
            )}

            <hr />

            <button onClick={() => navigate("/cases")}>
                Cases
            </button>

            <button onClick={() => navigate("/documents")}>
                Documents
            </button>
            <button onClick={() => navigate("/search")}>
    Search
</button>

            <br />
            <br />

            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;