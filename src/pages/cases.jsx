
import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Cases() {
    const [cases, setCases] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [closingCaseId, setClosingCaseId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const limit = 10;

    // ==========================================
    // GET CASES
    // ==========================================

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

    // ==========================================
    // CREATE CASE
    // ==========================================

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

    // ==========================================
    // CLOSE CASE
    // ==========================================

    const handleCloseCase = async (caseId) => {
        const confirmed = window.confirm(
            "Are you sure you want to close this case?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setClosingCaseId(caseId);
            setError("");
            setSuccess("");

            await api.put(`/cases/${caseId}/close`);

            setSuccess("Case closed successfully.");

            await fetchCases();
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to close case"
            );
        } finally {
            setClosingCaseId(null);
        }
    };

    const totalPages = Math.ceil(total / limit);

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ================================
                TOP BAR
            ================================= */}

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Cases
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage and monitor investigation cases
                        </p>
                    </div>

                    <BackButton
                        to="/dashboard"
                        label="Back to Dashboard"
                    />
                </div>
            </header>

            {/* ================================
                MAIN CONTENT
            ================================= */}

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* ================================
                    ALERTS
                ================================= */}

                {success && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        ⚠ {error}
                    </div>
                )}

                {/* ================================
                    CREATE CASE CARD
                ================================= */}

                <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Create New Case
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Start a new investigation by providing the
                            case details below.
                        </p>
                    </div>

                    <form
                        onSubmit={handleCreateCase}
                        className="space-y-5"
                    >
                        {/* TITLE */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Case Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter case title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Description
                            </label>

                            <textarea
                                placeholder="Describe the case..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows="4"
                                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        {/* BUTTON */}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={creating}
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {creating
                                    ? "Creating..."
                                    : "+ Create Case"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* ================================
                    CASE LIST HEADER
                ================================= */}

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            All Cases
                        </h2>

                        <p className="text-sm text-slate-500">
                            {total} case{total !== 1 ? "s" : ""} in the system
                        </p>
                    </div>
                </div>

                {/* ================================
                    CASE LIST
                ================================= */}

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>

                        <p className="text-sm text-slate-500">
                            Loading cases...
                        </p>
                    </div>
                ) : cases.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <div className="mb-3 text-4xl">
                            📁
                        </div>

                        <h3 className="font-semibold text-slate-900">
                            No cases found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first case using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {cases.map((caseItem) => {
                            const normalizedStatus =
                                String(caseItem.status || "").toLowerCase();
                            const isClosed = normalizedStatus === "closed";
                            const isActive = normalizedStatus === "open";

                            const statusLabel =
                                isClosed ? "Closed" : isActive ? "Active" : "Unknown";

                            const isClosing =
                                closingCaseId === caseItem.id;

                            return (
                                <div
                                    key={caseItem.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    {/* CARD HEADER */}

                                    <div className="mb-5 flex items-start justify-between gap-4">

                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-semibold text-slate-900">
                                                {caseItem.title}
                                            </h3>

                                            <p className="mt-1 font-mono text-xs text-slate-400">
                                                {caseItem.id}
                                            </p>
                                        </div>

                                        {/* STATUS */}

                                        {isClosed ? (
                                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                🔒 Closed
                                            </span>
                                        ) : (
                                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                ● {statusLabel}
                                            </span>
                                        )}
                                    </div>

                                    {/* DESCRIPTION */}

                                    {caseItem.description && (
                                        <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                                            {caseItem.description}
                                        </p>
                                    )}

                                    {/* DETAILS */}

                                    <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Status
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {statusLabel}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Created
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {new Date(
                                                    caseItem.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ACTION */}

                                    <div className="flex justify-end border-t border-slate-100 pt-4">

                                        {isClosed ? (
                                            <span className="text-sm font-medium text-slate-400">
                                                Case permanently closed
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleCloseCase(
                                                        caseItem.id
                                                    )
                                                }
                                                disabled={isClosing}
                                                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isClosing
                                                    ? "Closing..."
                                                    : "Close Case"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ================================
                    PAGINATION
                ================================= */}

                <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ← Previous
                    </button>

                    <span className="text-sm text-slate-500">
                        Page{" "}
                        <span className="font-semibold text-slate-900">
                            {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">
                            {totalPages || 1}
                        </span>
                    </span>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Cases;

