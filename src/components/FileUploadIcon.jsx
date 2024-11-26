import React, { useRef } from "react";
import "./FileUploadIcon.css";
import { FaPaperclip } from "react-icons/fa"; // Importing from react-icons
import Arweave from "arweave";


export default function FileUploadIcon({ onFileUpload  }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "text/csv"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF, Image, or CSV.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/upload/generate-embeddings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const responseData = await response.json();
      console.log("File uploaded successfully:", responseData);
      const embeddingData = responseData.data;
      // create arweave client
      const arweave = new Arweave({
        host: "ar-io.net",
        port: 443,
        protocol: "https"
      });

      // connect to the extension
      await window.arweaveWallet.connect(["SIGN_TRANSACTION", "DISPATCH"]);
      // create a transaction
      let transaction = await arweave.createTransaction({
        data: JSON.stringify({
          data: embeddingData
        })
      });

      // sign using arweave-js
      const signedFields = await window.arweaveWallet.sign(transaction);

      // update transaction fields with the
      // signed transaction's fields
      transaction.setSignature({
        id: signedFields.id,
        owner: signedFields.owner,
        reward: signedFields.reward,
        tags: signedFields.tags,
        signature: signedFields.signature
      });
      // dispatch the tx
      const res = await window.arweaveWallet.dispatch(transaction);
      //log res
      console.log("transaction res : ", res);
   
    } catch (error) {

      //log error 
      console.log("error while uploading file : ", error);
    }



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
