import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Search() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!query.trim()) {
            setError("Please enter a search query.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get("/search", {
                params: {
                    q: query,
                    page: 1,
                    limit: 10,
                },
            });

            setResults(response.data.results);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Search failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>

            <h1>Search Evidence</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <p>🔴 {error}</p>}

            <hr />

            <h2>Results</h2>

            {!loading && results.length === 0 && query && (
                <p>No documents found.</p>
            )}

            {results.map((document) => (
                <div key={document.id}>
                    <h3
                        onClick={() =>
                            navigate(`/documents/${document.id}`)
                        }
                        style={{ cursor: "pointer" }}
                    >
                        {document.filename}
                    </h3>

                    <p>Document ID: {document.id}</p>
                    <p>Case ID: {document.case_id}</p>
                    <p>Type: {document.document_type}</p>
                    <p>
                        Confidentiality:{" "}
                        {document.confidentiality_level}
                    </p>
                    <p>
                        Version: {document.current_version}
                    </p>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Search;