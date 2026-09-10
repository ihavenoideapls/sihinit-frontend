import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search as SearchIcon,
    FileText,
    ChevronRight,
    X,
    SlidersHorizontal,
} from "lucide-react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Search() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!query.trim()) {
            setError("Please enter a search query.");
            setHasSearched(false);
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setHasSearched(false);

            const response = await api.get("/search", {
                params: {
                    q: query.trim(),
                    page: 1,
                    limit: 10,
                },
            });

            setResults(response.data.results || []);
            setHasSearched(true);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Search failed"
            );
            setResults([]);
            setHasSearched(false);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setError("");
        setHasSearched(false);
    };

    const getConfidentialityStyle = (level) => {
        switch (level?.toLowerCase()) {
            case "public":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "internal":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "confidential":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "restricted":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    return (
        <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <div className="mb-8">

                <div className="mb-3">
                    <BackButton
                        to="/dashboard"
                        label="Back to Dashboard"
                    />
                </div>

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <SearchIcon size={21} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Search Evidence
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Find documents across the evidence repository
                        </p>
                    </div>

                </div>

            </div>

            {/* SEARCH CARD */}
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <SlidersHorizontal size={17} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            Evidence Search
                        </h2>

                        <p className="text-xs text-slate-500">
                            Search by document information or case details
                        </p>
                    </div>

                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row"
                >

                    <div className="relative flex-1">

                        <SearchIcon
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);

                                // Don't show "no results" while typing
                                setHasSearched(false);
                                setError("");
                            }}
                            className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                        />

                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={16} />
                            </button>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <SearchIcon size={17} />
                                Search
                            </>
                        )}

                    </button>

                </form>

            </section>

            {/* ERROR */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    ⚠ {error}
                </div>
            )}

            {/* RESULTS HEADER */}
            {hasSearched && !loading && (
                <div className="mb-4 flex items-end justify-between">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            Search Results
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {results.length} result
                            {results.length !== 1 ? "s" : ""} found for{" "}
                            <span className="font-medium text-slate-700">
                                "{query}"
                            </span>
                        </p>

                    </div>

                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

                    <p className="text-sm text-slate-500">
                        Searching evidence repository...
                    </p>

                </div>
            )}

            {/* EMPTY SEARCH RESULTS */}
            {hasSearched &&
                !loading &&
                results.length === 0 &&
                !error && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <SearchIcon size={26} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No evidence found
                        </h3>

                        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                            We couldn't find any documents matching your
                            search. Try a different document name, case ID,
                            or keyword.
                        </p>

                    </div>
                )}

            {/* INITIAL STATE */}
            {!loading && !hasSearched && !query && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <SearchIcon size={26} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                        Search the evidence repository
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                        Enter a keyword above to find documents and
                        evidence associated with your investigation cases.
                    </p>

                </div>
            )}

            {/* RESULTS */}
            {!loading && results.length > 0 && (

                <div className="space-y-3">

                    {results.map((document) => (

                        <button
                            key={document.id}
                            onClick={() =>
                                navigate(`/documents/${document.id}`)
                            }
                            className="group flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:flex-row md:items-center"
                        >

                            {/* DOCUMENT ICON */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">

                                <FileText size={22} />

                            </div>

                            {/* INFORMATION */}
                            <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h3 className="truncate text-sm font-semibold text-slate-900">
                                        {document.filename}
                                    </h3>

                                    {document.confidentiality_level && (
                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getConfidentialityStyle(
                                                document.confidentiality_level
                                            )}`}
                                        >
                                            {document.confidentiality_level}
                                        </span>
                                    )}

                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">

                                    <span>
                                        Document ID:{" "}
                                        <span className="font-mono text-slate-500">
                                            {document.id}
                                        </span>
                                    </span>

                                    <span>
                                        Case:{" "}
                                        <span className="font-mono text-slate-500">
                                            {document.case_id}
                                        </span>
                                    </span>

                                    <span>
                                        Type:{" "}
                                        <span className="text-slate-500">
                                            {document.document_type ||
                                                "Not specified"}
                                        </span>
                                    </span>

                                    <span>
                                        Version:{" "}
                                        <span className="font-medium text-slate-500">
                                            v{document.current_version}
                                        </span>
                                    </span>

                                </div>

                            </div>

                            {/* OPEN */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 transition group-hover:bg-slate-100 group-hover:text-slate-700">

                                <ChevronRight size={19} />

                            </div>

                        </button>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Search;