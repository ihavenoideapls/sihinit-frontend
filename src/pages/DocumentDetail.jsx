import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowDownToLine,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck2,
    FileText,
    Hash,
    History,
    Lock,
    ShieldCheck,
    Upload,
    User,
    XCircle,
} from "lucide-react";

import api from "../services/api";
import BackButton from "../components/BackButton";

function DocumentDetail() {
    const { id } = useParams();

    const [document, setDocument] = useState(null);
    const [versions, setVersions] = useState([]);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchDocument = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/documents/${id}`);

            const versionsResponse = await api.get(
                `/documents/${id}/versions`
            );

            setDocument(response.data);
            setVersions(versionsResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to load document"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [id]);

    useEffect(() => {
        let objectUrl = "";

        const fetchPreview = async () => {
            if (!document?.filename) return;

            try {
                setPreviewLoading(true);
                const response = await api.get(
                    `/documents/${id}/preview`,
                    { responseType: "blob" }
                );

                const contentType = response.data.type || "";
                const isImage =
                    contentType.startsWith("image/") ||
                    /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(document?.filename || "");
                const isPdf =
                    contentType === "application/pdf" ||
                    /\.pdf$/i.test(document?.filename || "");
                if (
                    isImage ||
                    isPdf
                ) {
                    objectUrl = URL.createObjectURL(response.data);
                    setPreviewUrl(objectUrl);
                } else {
                    setPreviewUrl("");
                }
            } catch {
                setPreviewUrl("");
            } finally {
                setPreviewLoading(false);
            }
        };

        fetchPreview();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [id, document?.filename]);

    const handleVersionUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setError("Please select a file.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post(
                `/documents/${id}/versions`,
                formData
            );

            setSuccess(
                `Version ${response.data.version} uploaded successfully.`
            );

            setFile(null);

            event.target.reset();

            await fetchDocument();
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                "Failed to upload new version"
            );
        } finally {
            setUploading(false);
        }
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

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="h-10 w-2/3 rounded bg-slate-200" />
                    <div className="h-40 rounded-2xl bg-slate-200" />
                    <div className="h-48 rounded-2xl bg-slate-200" />
                </div>
            </div>
        );
    }

    if (error && !document) {
        return (
            <div className="mx-auto max-w-6xl">
                <BackButton
                    to="/documents"
                    label="Back to Documents"
                />

                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                    <div className="flex items-center gap-3">
                        <XCircle className="text-red-600" size={22} />

                        <div>
                            <h2 className="font-semibold text-red-800">
                                Unable to load document
                            </h2>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="mx-auto max-w-6xl">
                <BackButton
                    to="/documents"
                    label="Back to Documents"
                />

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <FileText
                        size={42}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="mt-4 text-lg font-semibold text-slate-800">
                        Document not found
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        The requested document could not be found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">

            {/* Back */}
            <BackButton
                to="/documents"
                label="Back to Documents"
            />

            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <FileText size={26} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900">
                                {document.filename}
                            </h1>

                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getConfidentialityStyle(
                                    document.confidentiality_level
                                )}`}
                            >
                                {document.confidentiality_level}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Secure evidence document
                        </p>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        try {
                            const response = await api.get(
                                `/documents/${document.id}/download`,
                                { responseType: "blob" }
                            );
                            const url = URL.createObjectURL(response.data);
                            const link = window.document.createElement("a");
                            link.href = url;
                            link.download = document.filename;
                            link.click();
                            URL.revokeObjectURL(url);
                        } catch (err) {
                            setError(
                                err.response?.data?.error?.message ||
                                    "Failed to download document"
                            );
                        }
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                    <ArrowDownToLine size={18} />
                    Download Document
                </button>
            </div>

            {/* Alerts */}
            {success && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <XCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-semibold text-slate-900">
                        Document Preview
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Preview the saved file securely from the document repository
                    </p>
                </div>

                <div className="p-6">
                    {previewLoading ? (
                        <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                            Loading preview...
                        </div>
                                        ) : previewUrl && /\.pdf$/i.test(document.filename) ? (
                        <iframe
                            src={previewUrl}
                            title={`Preview of ${document.filename}`}
                            className="h-[30rem] w-full rounded-xl border border-slate-200 bg-white"
                        />
                    ) : previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={`Preview of ${document.filename}`}
                            className="max-h-[30rem] w-full rounded-xl border border-slate-200 object-contain"
                        />
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            Preview is not available for this file type.
                        </div>
                    )}
                </div>
            </section>

            {/* Document Information */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                            <FileCheck2
                                size={19}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Document Information
                            </h2>

                            <p className="text-xs text-slate-500">
                                Metadata and ownership details
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            <Hash size={14} />
                            Document ID
                        </div>

                        <p className="break-all font-mono text-sm text-slate-700">
                            {document.id}
                        </p>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            <Lock size={14} />
                            Case ID
                        </div>

                        <p className="break-all font-mono text-sm text-slate-700">
                            {document.case_id}
                        </p>
                    </div>

                    <div>
                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Document Type
                        </div>

                        <p className="text-sm font-medium capitalize text-slate-700">
                            {document.document_type}
                        </p>
                    </div>

                    <div>
                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Current Version
                        </div>

                        <p className="text-sm font-semibold text-slate-800">
                            v{document.current_version}
                        </p>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            <User size={14} />
                            Uploaded By
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                            {document.uploaded_by.name}
                        </p>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            <Calendar size={14} />
                            Created
                        </div>

                        <p className="text-sm text-slate-700">
                            {new Date(
                                document.created_at
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
            </section>

            {/* Integrity */}
            <section
                className={`rounded-2xl border shadow-sm ${
                    document.hash_verified
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-red-200 bg-red-50/40"
                }`}
            >
                <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                document.hash_verified
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {document.hash_verified ? (
                                <ShieldCheck size={23} />
                            ) : (
                                <XCircle size={23} />
                            )}
                        </div>

                        <div>
                            <h2
                                className={`font-semibold ${
                                    document.hash_verified
                                        ? "text-emerald-900"
                                        : "text-red-900"
                                }`}
                            >
                                {document.hash_verified
                                    ? "Integrity Verified"
                                    : "Integrity Check Failed"}
                            </h2>

                            <p
                                className={`mt-1 text-sm ${
                                    document.hash_verified
                                        ? "text-emerald-700"
                                        : "text-red-700"
                                }`}
                            >
                                {document.hash_verified
                                    ? "The document hash matches the recorded integrity value."
                                    : "The document integrity verification did not pass."}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                            document.hash_verified
                                ? "border-emerald-200 bg-white text-emerald-700"
                                : "border-red-200 bg-white text-red-700"
                        }`}
                    >
                        SHA-256
                    </div>
                </div>

                <div className="border-t border-slate-200/70 px-6 py-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Current Hash
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
                        <code className="break-all font-mono text-xs leading-6 text-slate-700">
                            {document.hash}
                        </code>
                    </div>
                </div>
            </section>

            {/* Upload New Version */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                            <Upload
                                size={19}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Upload New Version
                            </h2>

                            <p className="text-xs text-slate-500">
                                Add a new version while preserving document history
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleVersionUpload}
                    className="p-6"
                >
                    <label
                        htmlFor="version-file"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-300 hover:bg-slate-100"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                            <Upload
                                size={22}
                                className="text-slate-500"
                            />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-700">
                            {file
                                ? file.name
                                : "Choose a file to upload"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            {file
                                ? "File selected and ready to upload"
                                : "Upload the next version of this document"}
                        </p>

                        <input
                            id="version-file"
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Upload size={18} />

                        {uploading
                            ? "Uploading..."
                            : "Upload New Version"}
                    </button>
                </form>
            </section>

            {/* Version History */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                            <History
                                size={19}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Version History
                            </h2>

                            <p className="text-xs text-slate-500">
                                Complete version and integrity history
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {versions.length === 0 ? (
                        <div className="py-10 text-center">
                            <History
                                size={38}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 text-sm font-medium text-slate-600">
                                No versions found
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Version history will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {versions.map((version, index) => (
                                <div
                                    key={version.version}
                                    className="relative rounded-xl border border-slate-200 bg-slate-50 p-5"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                                                v{version.version}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    Version{" "}
                                                    {version.version}
                                                </h3>

                                                <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                                                    <p className="flex items-center gap-2">
                                                        <User size={14} />
                                                        Uploaded by:{" "}
                                                        <span className="font-medium text-slate-700">
                                                            {
                                                                version.uploaded_by
                                                            }
                                                        </span>
                                                    </p>

                                                    <p className="flex items-center gap-2">
                                                        <Clock size={14} />
                                                        {new Date(
                                                            version.created_at
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {index === 0 && (
                                            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                Current Version
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            <Hash size={14} />
                                            SHA-256
                                        </div>

                                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3">
                                            <code className="break-all font-mono text-xs leading-5 text-slate-600">
                                                {version.hash}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default DocumentDetail;