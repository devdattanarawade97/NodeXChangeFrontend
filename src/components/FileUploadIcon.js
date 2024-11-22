import React, { useRef } from "react";
import "./FileUploadIcon.css";
import { FaPaperclip } from "react-icons/fa"; // Importing from react-icons
export default function FileUploadIcon({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "text/csv"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a PDF, Image, or CSV.");
      return;
    }

    onFileUpload(file); // Callback to handle file
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <button className="file-upload-button" onClick={triggerFileInput} aria-label="Upload File">
      <FaPaperclip size={18} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,image/png,image/jpeg,.csv"
        onChange={handleFileChange}
      />
    </div>
  );
}
