const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
const upload = multer({
    dest: "uploads/",
});

const PORT = 3000;
const SECRET = "sih-test-secret";

// ==========================================
// FAKE USER
// ONLY FOR FRONTEND TESTING
// ==========================================

const user = {
    id: "usr_123",
    name: "Jane Doe",
    email: "jane@example.gov",
    password: "string",
    role: "investigator",
};

// ==========================================
// AUTHENTICATION
// ==========================================

// LOGIN
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (email !== user.email || password !== user.password) {
        return res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "Invalid email or password",
            },
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        SECRET,
        {
            expiresIn: "1h",
        }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
        },
    });
});

// GET CURRENT USER
app.get("/auth/me", (req, res) => {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "No token provided",
            },
        });
    }

    try {
        const token = auth.split(" ")[1];

        const decoded = jwt.verify(token, SECRET);

        res.json({
            id: decoded.id,
            name: user.name,
            role: decoded.role,
        });
    } catch {
        res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "Invalid token",
            },
        });
    }
});

// ==========================================
// CASES
// ==========================================

let cases = [
    {
        id: "case_1",
        title: "State vs. XYZ",
        description: "Test case",
        status: "open",
        created_at: "2026-08-01T10:00:00Z",
    },
];

// GET /cases
// Supports pagination
//
// Example:
// GET /cases?page=1&limit=10
app.get("/cases", (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const start = (page - 1) * limit;

    const results = cases.slice(
        start,
        start + limit
    );

    res.json({
        total: cases.length,
        page,
        results,
    });
});

// CREATE CASE
// POST /cases
//
// Body:
// {
//     "title": "State vs. ABC",
//     "description": "Case description"
// }
app.post("/cases", (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Title is required",
            },
        });
    }

    const newCase = {
        id: `case_${cases.length + 1}`,
        title,
        description: description || "",
        status: "open",
        created_at: new Date().toISOString(),
    };

    cases.push(newCase);

    res.status(201).json({
        id: newCase.id,
        title: newCase.title,
        status: newCase.status,
    });
});
// ==========================================
// DOCUMENTS
// ==========================================

let documents = [];
let auditLogs = [];
function createAuditLog({
    action,
    document_id = null,
    case_id = null,
    details = "",
}) {
    const log = {
        id: `audit_${auditLogs.length + 1}`,
        action,
        document_id,
        case_id,
        user_id: user.id,
        user_name: user.name,
        timestamp: new Date().toISOString(),
        details,
    };

    auditLogs.push(log);

    return log;
}

// POST /documents/upload
app.post(
    "/documents/upload",
    upload.single("file"),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "File is required",
                },
            });
        }

        const {
            case_id,
            document_type,
            confidentiality_level,
        } = req.body;

        if (!case_id) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "case_id is required",
                },
            });
        }

        // Calculate SHA-256 hash
        const hash = crypto
            .createHash("sha256")
            .update(require("fs").readFileSync(req.file.path))
            .digest("hex");

        const newDocument = {
            id: `doc_${documents.length + 1}`,
            filename: req.file.originalname,
            stored_filename: req.file.filename,
            case_id,
            document_type: document_type || "unknown",
            confidentiality_level:
                confidentiality_level || "internal",
            hash,
            version: 1,
            uploaded_by: user.id,
            created_at: new Date().toISOString(),
        };

        documents.push(newDocument);
        createAuditLog({
    action: "DOCUMENT_UPLOADED",
    document_id: newDocument.id,
    case_id: newDocument.case_id,
    details: `Uploaded ${newDocument.filename} as version 1`,
});

        res.status(201).json({
            id: newDocument.id,
            filename: newDocument.filename,
            case_id: newDocument.case_id,
            hash: newDocument.hash,
            version: newDocument.version,
            confidentiality_level:
                newDocument.confidentiality_level,
            uploaded_by: newDocument.uploaded_by,
            created_at: newDocument.created_at,
        });
    }
);// GET /documents
// GET /documents/:id/download
app.get("/documents/:id/download", (req, res) => {
    const document = documents.find(
        (doc) => doc.id === req.params.id
    );

    if (!document) {
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: "Document not found",
            },
        });
    }

    const fs = require("fs");

    const filePath = `uploads/${document.stored_filename}`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: "Stored file not found",
            },
        });
    }
    createAuditLog({
    action: "DOCUMENT_DOWNLOADED",
    document_id: document.id,
    case_id: document.case_id,
    details: `Downloaded ${document.filename}`,
});

    res.download(
        filePath,
        document.filename,
        (err) => {
            if (err && !res.headersSent) {
                res.status(500).json({
                    error: {
                        code: "SERVER_ERROR",
                        message: "Failed to download document",
                    },
                });
            }
        }
    );
});
// Example:
// GET /documents?page=1&limit=10s

app.get("/documents", (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const start = (page - 1) * limit;

    const results = documents
        .slice(start, start + limit)
        .map((doc) => ({
            id: doc.id,
            filename: doc.filename,
            case_id: doc.case_id,
            document_type: doc.document_type,
            confidentiality_level: doc.confidentiality_level,
            current_version: doc.version,
            created_at: doc.created_at,
        }));

    res.json({
        total: documents.length,
        page,
        results,
    });
});
// GET /documents/:id
app.get("/documents/:id", (req, res) => {
    const document = documents.find(
        (doc) => doc.id === req.params.id
    );

    if (!document) {
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: "Document not found",
            },
        });
    }

    // For now, verify the stored file against its original hash
    const fs = require("fs");

    let hashVerified = false;

    try {
        const fileBuffer = fs.readFileSync(
            `uploads/${document.stored_filename}`
        );

        const currentHash = crypto
            .createHash("sha256")
            .update(fileBuffer)
            .digest("hex");

        hashVerified = currentHash === document.hash;
    } catch {
        hashVerified = false;
    }
    createAuditLog({
    action: "DOCUMENT_VIEWED",
    document_id: document.id,
    case_id: document.case_id,
    details: `Viewed ${document.filename}`,
});

    res.json({
        id: document.id,
        filename: document.filename,
        case_id: document.case_id,
        document_type: document.document_type,
        confidentiality_level: document.confidentiality_level,
        hash: document.hash,
        hash_verified: hashVerified,
        current_version: document.version,
        uploaded_by: {
            id: document.uploaded_by,
            name: user.name,
        },
        created_at: document.created_at,
    });
});
// GET /documents/:id/versions

app.get("/documents/:id/versions", (req, res) => {
    const document = documents.find(
        (doc) => doc.id === req.params.id
    );

    if (!document) {
        return res.status(404).json({
            error: {
                code: "NOT_FOUND",
                message: "Document not found",
            },
        });
    }

    // If no version history exists yet,
    // create Version 1 from the original upload.
    if (!document.versions) {
        document.versions = [
            {
                version: 1,
                hash: document.hash,
                uploaded_by: document.uploaded_by,
                created_at: document.created_at,
                stored_filename: document.stored_filename,
            },
        ];
    }

    res.json(
        document.versions.map((version) => ({
            version: version.version,
            hash: version.hash,
            uploaded_by: version.uploaded_by,
            created_at: version.created_at,
        }))
    );
});
// POST /documents/:id/versions
// Upload a new version of an existing document

app.post(
    "/documents/:id/versions",
    upload.single("file"),
    (req, res) => {
        const document = documents.find(
            (doc) => doc.id === req.params.id
        );

        if (!document) {
            return res.status(404).json({
                error: {
                    code: "NOT_FOUND",
                    message: "Document not found",
                },
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "File is required",
                },
            });
        }

        const fs = require("fs");

        // Initialize version history with Version 1
        if (!document.versions) {
            document.versions = [
                {
                    version: 1,
                    hash: document.hash,
                    uploaded_by: document.uploaded_by,
                    created_at: document.created_at,
                    stored_filename: document.stored_filename,
                },
            ];
        }

        // Calculate SHA-256 of new file
        const hash = crypto
            .createHash("sha256")
            .update(fs.readFileSync(req.file.path))
            .digest("hex");

        const newVersion = document.version + 1;
        const created_at = new Date().toISOString();

        // Add new version to history
        document.versions.push({
            version: newVersion,
            hash,
            uploaded_by: user.id,
            created_at,
            stored_filename: req.file.filename,
        });

        // Update current document
        document.version = newVersion;
        document.stored_filename = req.file.filename;
        document.filename = req.file.originalname;
        document.hash = hash;
        createAuditLog({
    action: "VERSION_CREATED",
    document_id: document.id,
    case_id: document.case_id,
    details: `Created version ${newVersion} of ${document.filename}`,
});

        res.status(201).json({
            id: document.id,
            version: newVersion,
            hash,
            uploaded_by: user.id,
            created_at,
        });
    }
);
// SEARCH DOCUMENTS
app.get("/search", (req, res) => {
    const {
        q,
        page = 1,
        limit = 10,
    } = req.query;

    if (!q || !q.trim()) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Search query is required",
            },
        });
    }

    const searchTerm = q.trim().toLowerCase();

    const filtered = documents.filter((doc) => {
        return (
            doc.filename.toLowerCase().includes(searchTerm) ||
            doc.case_id.toLowerCase().includes(searchTerm) ||
            doc.document_type.toLowerCase().includes(searchTerm) ||
            doc.id.toLowerCase().includes(searchTerm)
        );
    });

    const pageNumber = Number(page) || 1;
    const pageLimit = Number(limit) || 10;

    const start = (pageNumber - 1) * pageLimit;

    const results = filtered
        .slice(start, start + pageLimit)
        .map((doc) => ({
            id: doc.id,
            filename: doc.filename,
            case_id: doc.case_id,
            document_type: doc.document_type,
            confidentiality_level: doc.confidentiality_level,
            current_version: doc.version,
            created_at: doc.created_at,
        }));

    res.json({
        total: filtered.length,
        page: pageNumber,
        results,
    });
});
// ==========================================
// GET AUDIT TRAIL
// ==========================================

app.get("/audit", (req, res) => {
    const {
        document_id,
        user_id,
        page = 1,
        limit = 20,
    } = req.query;

    let results = [...auditLogs];

    if (document_id) {
        results = results.filter(
            (log) => log.document_id === document_id
        );
    }

    if (user_id) {
        results = results.filter(
            (log) => log.user_id === user_id
        );
    }

    // Newest first
    results.reverse();

    const pageNumber = Number(page) || 1;
    const pageLimit = Number(limit) || 20;

    const start = (pageNumber - 1) * pageLimit;

    const paginatedResults = results.slice(
        start,
        start + pageLimit
    );

    res.json({
        total: results.length,
        page: pageNumber,
        results: paginatedResults,
    });
});
// ==========================================
// VERIFY AUDIT TRAIL
// ==========================================

app.get("/audit/verify", (req, res) => {
    res.json({
        verified: true,
        total_entries: auditLogs.length,
        broken_at: null,
    });
});
app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKS");
});

// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});