import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Documents() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);

    const [file, setFile] = useState(null);
    const [caseId, setCaseId] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [confidentiality, setConfidentiality] = useState("internal");

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const limit = 10;

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

    useEffect(() => {
        fetchDocuments();
    }, [page]);

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

            // Refresh document list
            setPage(1);

            // Directly refresh after upload
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
    // UI
    // ==========================================

    return (
        <div>
            <h1>Documents</h1>

            {/* ================================
                UPLOAD
            ================================= */}

            <h2>Upload Document</h2>

            <form onSubmit={handleUpload}>

                <div>
                    <label>File</label>
                    <br />

                    <input
                        type="file"
                        onChange={(e) =>
                            setFile(e.target.files[0])
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Case ID</label>
                    <br />

                    <input
                        type="text"
                        placeholder="case_1"
                        value={caseId}
                        onChange={(e) =>
                            setCaseId(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Document Type</label>
                    <br />

                    <input
                        type="text"
                        placeholder="statement"
                        value={documentType}
                        onChange={(e) =>
                            setDocumentType(e.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Confidentiality</label>
                    <br />

                    <select
                        value={confidentiality}
                        onChange={(e) =>
                            setConfidentiality(e.target.value)
                        }
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

                <br />

                <button
                    type="submit"
                    disabled={uploading}
                >
                    {uploading
                        ? "Uploading..."
                        : "Upload Document"}
                </button>
            </form>

            {success && <p>{success}</p>}

            {error && <p>{error}</p>}

            <hr />

            {/* ================================
                DOCUMENT LIST
            ================================= */}

            <h2>All Documents</h2>

            {loading ? (
                <p>Loading documents...</p>
            ) : documents.length === 0 ? (
                <p>No documents found.</p>
            ) : (
                documents.map((document) => (
                    <div key={document.id}>
                        <h3
                        onClick={() => navigate(`/documents/${document.id}`)}
                        style={{ cursor: "pointer" }}
                                                            >
                         {document.filename}
                            </h3>

                        <p>
                            Document ID: {document.id}
                        </p>

                        <p>
                            Case ID: {document.case_id}
                        </p>

                        <p>
                            Type: {document.document_type}
                        </p>

                        <p>
                            Confidentiality:{" "}
                            {document.confidentiality_level}
                        </p>

                        <p>
                            Version:{" "}
                            {document.current_version}
                        </p>

                        <p>
                            Created:{" "}
                            {new Date(
                                document.created_at
                            ).toLocaleString()}
                        </p>

                        <hr />
                    </div>
                ))
            )}

            {/* ================================
                PAGINATION
            ================================= */}

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

export default Documents;