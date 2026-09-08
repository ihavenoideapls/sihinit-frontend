
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function DocumentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [document, setDocument] = useState(null);
    const [versions, setVersions] = useState([]);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
                err.response?.data?.error?.messsage ||
                "Failed to load document"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [id]);

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

    if (loading) {
        return <p>Loading document...</p>;
    }

    if (error && !document) {
        return <p>{error}</p>;
    }

    if (!document) {
        return <p>Document not found.</p>;
    }

    return (
        <div>
            <button onClick={() => navigate("/documents")}>
                Back to Documents
            </button>

            <h1>{document.filename}</h1>

            <p>Document ID: {document.id}</p>

            <p>Case ID: {document.case_id}</p>

            <p>
                Document Type:{" "}
                {document.document_type}
            </p>

            <p>
                Confidentiality:{" "}
                {document.confidentiality_level}
            </p>

            <p>
                Current Version:{" "}
                {document.current_version}
            </p>

            <p>
                Uploaded by:{" "}
                {document.uploaded_by.name}
            </p>

            <p>
                Created:{" "}
                {new Date(
                    document.created_at
                ).toLocaleString()}
            </p>

            <hr />

            <h2>Integrity</h2>

            {document.hash_verified ? (
                <p>🟢 Integrity Verified</p>
            ) : (
                <p>🔴 Integrity Check Failed</p>
            )}

            <p>Current SHA-256:</p>

            <code>{document.hash}</code>

            <br />
            <br />

            <button
                onClick={() =>
                    window.open(
                        `http://localhost:3000/documents/${document.id}/download`,
                        "_blank"
                    )
                }
            >
                Download Current Document
            </button>

            <hr />

            <h2>Upload New Version</h2>

            <form onSubmit={handleVersionUpload}>
                <input
                    type="file"
                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }
                    required
                />

                <br />
                <br />

                <button
                    type="submit"
                    disabled={uploading}
                >
                    {uploading
                        ? "Uploading..."
                        : "Upload New Version"}
                </button>
            </form>

            {success && (
                <p>🟢 {success}</p>
            )}

            {error && (
                <p>🔴 {error}</p>
            )}

            <hr />

            <h2>Version History</h2>

            {versions.length === 0 ? (
                <p>No versions found.</p>
            ) : (
                versions.map((version) => (
                    <div key={version.version}>
                        <h3>
                            Version {version.version}
                        </h3>

                        <p>
                            Uploaded by:{" "}
                            {version.uploaded_by}
                        </p>

                        <p>
                            Created:{" "}
                            {new Date(
                                version.created_at
                            ).toLocaleString()}
                        </p>

                        <p>SHA-256:</p>

                        <code>
                            {version.hash}
                        </code>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default DocumentDetail;

