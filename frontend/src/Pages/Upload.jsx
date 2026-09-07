import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setStatus("");
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/audit/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setStatus("Upload successful!");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-card">

        <h1>Upload Audit Record</h1>

        <p className="upload-description">
          Upload an audit file to securely store and verify its integrity.
        </p>

        <form onSubmit={handleUpload}>

          <label className="file-drop">
            <input
              type="file"
              onChange={handleFileChange}
            />

            <span className="upload-icon">↑</span>

            <strong>
              {file ? file.name : "Choose an audit file"}
            </strong>

            <small>
              {file
                ? `${(file.size / 1024).toFixed(2)} KB`
                : "Click to browse files"}
            </small>
          </label>

          <button
            type="submit"
            className="upload-submit"
          >
            Upload Audit →
          </button>

        </form>

        {status && (
          <p className="upload-status">
            {status}
          </p>
        )}

      </div>
    </div>
  );
}

export default Upload;