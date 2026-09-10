
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Upload,
    FolderOpen,
    Shield,
    Lock,
    Eye,
    ChevronRight,
    FileCheck,
} from "lucide-react";
import api from "../services/api";
import BackButton from "../components/BackButton";

function Documents() {
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [caseOptions, setCaseOptions] = useState([]);

    const [file, setFile] = useState(null);
    const [caseId, setCaseId] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [confidentiality, setConfidentiality] =
        useState("internal");
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewText, setPreviewText] = useState("");

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCaseSuggestions, setShowCaseSuggestions] = useState(false);
    const caseInputRef = useRef(null);

    const limit = 10;
    const activeCaseOptions = caseOptions.filter(
        (option) => String(option.status || "").toLowerCase() !== "closed"
    );
    const caseSuggestions = caseId
        ? activeCaseOptions
              .filter((option) =>
                  option.id.toLowerCase().includes(caseId.toLowerCase())
              )
              .slice(0, 5)
        : [];

    // ==========================================
    // GET DOCUMENTS
    // ==========================================

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/documents", {
                params: {
                    page,
                    limit,
                },
            });

            setDocuments(response.data.results);
            setTotal(response.data.total);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to load documents"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCaseOptions = async () => {
        try {
            const response = await api.get("/cases", {
                params: {
                    page: 1,
                    limit: 100,
                },
            });
            setCaseOptions(response.data.results || []);
        } catch {
            setCaseOptions([]);
        }
    };

    useEffect(() => {
        fetchDocuments();
        fetchCaseOptions();
    }, [page]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (
                caseInputRef.current &&
                !caseInputRef.current.contains(event.target)
            ) {
                setShowCaseSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, []);

    useEffect(() => {
        if (!file) {
            setPreviewUrl("");
            setPreviewText("");
            return;
        }

        if (file.type.startsWith("image/") || file.type === "application/pdf") {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setPreviewText("");

            return () => URL.revokeObjectURL(objectUrl);
        }

        if (
            file.type.startsWith("text/") ||
            /\.(txt|csv|json|md|log|xml|html)$/i.test(file.name)
        ) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewText(String(reader.result || "").slice(0, 2000));
                setPreviewUrl("");
            };
            reader.onerror = () => {
                setPreviewText("");
                setPreviewUrl("");
            };
            reader.readAsText(file);
            return;
        }

        setPreviewUrl("");
        setPreviewText("");
    }, [file]);

    // ==========================================
    // UPLOAD DOCUMENT
    // ==========================================

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setError("Please select a file.");
            return;
        }

        if (!caseId) {
            setError("Please enter a case ID.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append("file", file);
            formData.append("case_id", caseId);
            formData.append("document_type", documentType);
            formData.append(
                "confidentiality_level",
                confidentiality
            );

            const response = await api.post(
                "/documents/upload",
                formData
            );

            setSuccess(
                `Document uploaded successfully. ID: ${response.data.id}`
            );

            setFile(null);
            setCaseId("");
            setDocumentType("");
            setConfidentiality("internal");

            event.target.reset();

            setPage(1);

            await fetchDocuments();
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to upload document"
            );
        } finally {
            setUploading(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    // ==========================================
    // CONFIDENTIALITY STYLING
    // ==========================================

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

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="mx-auto max-w-7xl">

            {/* ================================
                PAGE HEADER
            ================================= */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <div className="mb-2">
                        <BackButton
                            to="/dashboard"
                            label="Back to Dashboard"
                        />
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <FileText size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Documents
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage and preserve digital evidence
                            </p>
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <FileCheck
                        size={18}
                        className="text-emerald-600"
                    />

                    <div>
                        <p className="text-xs font-medium text-slate-400">
                            Total Evidence
                        </p>

                        <p className="text-sm font-semibold text-slate-900">
                            {total} document{total !== 1 ? "s" : ""}
                        </p>
                    </div>

                </div>

            </div>

            {/* ================================
                ALERTS
            ================================= */}

            {success && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    <FileCheck
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    ⚠ {error}
                </div>
            )}

            {/* ================================
                UPLOAD CARD
            ================================= */}

            <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                            <Upload size={19} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Upload Evidence
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Add a new document to an investigation case
                            </p>
                        </div>

                    </div>

                </div>

                <form
                    onSubmit={handleUpload}
                    className="p-6"
                >

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* FILE */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Evidence File
                            </label>

                            <label
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${
                                    file
                                        ? "border-emerald-300 bg-emerald-50"
                                        : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                                }`}
                            >

                                <Upload
                                    size={25}
                                    className={
                                        file
                                            ? "text-emerald-600"
                                            : "text-slate-400"
                                    }
                                />

                                <p className="mt-3 text-sm font-medium text-slate-700">
                                    {file
                                        ? file.name
                                        : "Click to select a file"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Select the evidence file you want to upload
                                </p>

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                        setFile(
                                            e.target.files[0]
                                        )
                                    }
                                    required
                                />

                            </label>

                            {file && (
                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-800">
                                            File preview
                                        </p>
                                        <span className="text-xs text-slate-500">
                                            {file.type || "Unknown type"}
                                        </span>
                                    </div>

                                    {file.type.startsWith("image/") && previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={file.name}
                                            className="max-h-64 w-full rounded-lg object-contain"
                                        />
                                    ) : file.type === "application/pdf" && previewUrl ? (
                                        <iframe
                                            src={previewUrl}
                                            title={file.name}
                                            className="h-80 w-full rounded-lg border border-slate-200 bg-white"
                                        />
                                    ) : previewText ? (
                                        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs leading-6 text-slate-700">
                                            {previewText}
                                        </pre>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                                            No preview available for this file type.
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* CASE ID */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Case ID
                            </label>

                            <div>
                                <div className="relative" ref={caseInputRef}>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <FolderOpen
                                            size={17}
                                            className="text-slate-400"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={caseId}
                                        autoComplete="off"
                                        spellCheck={false}
                                        onFocus={() => setShowCaseSuggestions(true)}
                                        onChange={(e) => {
                                            setCaseId(e.target.value);
                                            setShowCaseSuggestions(true);
                                        }}
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                                        style={{
                                            WebkitTextFillColor: "#0f172a",
                                            color: "#0f172a",
                                            backgroundColor: "#ffffff",
                                            WebkitAppearance: "none",
                                            appearance: "none",
                                        }}
                                        placeholder="case_1"
                                    />
                                </div>

                                {showCaseSuggestions && caseSuggestions.length > 0 && (
                                    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm">
                                        <div className="space-y-1">
                                            {caseSuggestions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onMouseDown={(event) => {
                                                        event.preventDefault();
                                                        setCaseId(option.id);
                                                        setShowCaseSuggestions(false);
                                                    }}
                                                    className="block w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-600 transition hover:bg-white hover:text-slate-900"
                                                >
                                                    {option.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                        {/* DOCUMENT TYPE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Document Type
                            </label>

                            <div className="relative">

                                <FileText
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="e.g. statement"
                                    value={documentType}
                                    onChange={(e) =>
                                        setDocumentType(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                                />

                            </div>

                        </div>

                        {/* CONFIDENTIALITY */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confidentiality Level
                            </label>

                            <div className="relative">

                                <Shield
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={confidentiality}
                                    onChange={(e) =>
                                        setConfidentiality(
                                            e.target.value
                                        )
                                    }
                                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                                >
                                    <option value="public">
                                        Public
                                    </option>

                                    <option value="internal">
                                        Internal
                                    </option>

                                    <option value="confidential">
                                        Confidential
                                    </option>

                                    <option value="restricted">
                                        Restricted
                                    </option>
                                </select>

                            </div>

                        </div>

                    </div>

                    {/* SUBMIT */}

                    <div className="mt-6 flex justify-end">

                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {uploading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={17} />
                                    Upload Evidence
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </section>

            {/* ================================
                DOCUMENT LIST HEADER
            ================================= */}

            <div className="mb-4 flex items-end justify-between">

                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Evidence Repository
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Select a document to view its details and version history.
                    </p>
                </div>

            </div>

            {/* ================================
                DOCUMENT LIST
            ================================= */}

            {loading ? (

                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

                    <p className="text-sm text-slate-500">
                        Loading evidence...
                    </p>

                </div>

            ) : documents.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <FileText size={26} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                        No documents found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Upload your first piece of evidence using the form above.
                    </p>

                </div>

            ) : (

                <div className="space-y-3">

                    {documents.map((document) => (

                        <button
                            key={document.id}
                            onClick={() =>
                                navigate(
                                    `/documents/${document.id}`
                                )
                            }
                            className="group flex w-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:flex-row md:items-center"
                        >

                            {/* ICON */}

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">

                                <FileText size={22} />

                            </div>

                            {/* MAIN INFO */}

                            <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h3 className="truncate text-sm font-semibold text-slate-900">
                                        {document.filename}
                                    </h3>

                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getConfidentialityStyle(
                                            document.confidentiality_level
                                        )}`}
                                    >
                                        {document.confidentiality_level}
                                    </span>

                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">

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

                            {/* DATE */}

                            <div className="hidden shrink-0 text-right md:block">

                                <p className="text-xs font-medium text-slate-400">
                                    Created
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                    {new Date(
                                        document.created_at
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                            {/* OPEN */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 transition group-hover:bg-slate-100 group-hover:text-slate-700">

                                <ChevronRight size={19} />

                            </div>

                        </button>

                    ))}

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

        </div>
    );
}

export default Documents;

