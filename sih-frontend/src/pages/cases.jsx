import { useEffect, useState } from "react";
import api from "../services/api";

function Cases() {
    const [cases, setCases] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const limit = 10;

    const fetchCases = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/cases", {
                params: {
                    page,
                    limit,
                },
            });

            setCases(response.data.results);
            setTotal(response.data.total);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to load cases"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, [page]);

    const handleCreateCase = async (event) => {
        event.preventDefault();

        try {
            setCreating(true);
            setError("");
            setSuccess("");

            await api.post("/cases", {
                title,
                description,
            });

            setTitle("");
            setDescription("");

            setSuccess("Case created successfully.");

            // Return to first page so the new case is visible
            setPage(1);

            await fetchCases();
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to create case"
            );
        } finally {
            setCreating(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <h1>Cases</h1>

            {/* CREATE CASE */}

            <h2>Create Case</h2>

            <form onSubmit={handleCreateCase}>
                <div>
                    <input
                        type="text"
                        placeholder="Case title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Case description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />
                </div>

                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Case"}
                </button>
            </form>

            {success && <p>{success}</p>}
            {error && <p>{error}</p>}

            <hr />

            {/* CASE LIST */}

            <h2>All Cases</h2>

            {loading ? (
                <p>Loading cases...</p>
            ) : cases.length === 0 ? (
                <p>No cases found.</p>
            ) : (
                cases.map((caseItem) => (
                    <div key={caseItem.id}>
                        <h3>{caseItem.title}</h3>

                        <p>
                            Case ID: {caseItem.id}
                        </p>

                        <p>
                            Status: {caseItem.status}
                        </p>

                        <p>
                            Created:{" "}
                            {new Date(
                                caseItem.created_at
                            ).toLocaleString()}
                        </p>

                        <hr />
                    </div>
                ))
            )}

            {/* PAGINATION */}

            <div>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span>
                    {" "}
                    Page {page} of {totalPages || 1}{" "}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Cases;