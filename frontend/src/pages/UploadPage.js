
// import React, { useState } from "react";
// import ImageDropArea from "../components/ImageDropArea";

// const uploadFile = async (file, tag, setMessage) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("tag", tag);

//   try {
//     const response = await fetch(`http://127.0.0.1:8000/upload/?tag=${tag}`, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     console.log("Upload Success:", data);
//     setMessage(`✅ Image uploaded successfully! Tag: ${tag}`);
//     return true;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     setMessage("❌ Upload failed. Please try again.");
//     return false;
//   }
// };

// const UploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [tag, setTag] = useState("");
//   const [message, setMessage] = useState("");
//   const [resetImages, setResetImages] = useState(false); // State to reset images

//   const handleUpload = async () => {
//     if (selectedFile && tag) {
//       const success = await uploadFile(selectedFile, tag, setMessage);
//       if (success) {
//         setTag(""); // Reset tag
//         setSelectedFile(null);
//         setResetImages(true);
//       }
//     } else {
//       setMessage("⚠️ Please select a file and enter a tag.");
//     }
//   };

//   return (
//     <div className="UploadPage">
//       {message && <p className="message">{message}</p>}

//       <h1 className="Intro">Upload Files</h1>

//       <input
//         type="text"
//         placeholder="Enter tag"
//         value={tag}
//         onChange={(e) => setTag(e.target.value)}
//         className="tag-input"
//       />
//       <ImageDropArea
//         onFileSelect={setSelectedFile}
//         reset={resetImages}
//         onResetComplete={() => setResetImages(false)} // Reset the reset flag
//       />

//       <button className="uploadbtn" onClick={handleUpload}>
//         Upload
//       </button>
//     </div>
//   );
// };

// export default UploadPage;

import React, { useState } from "react";
import ImageDropArea from "../components/ImageDropArea";

const uploadFiles = async (files, tag, setMessage) => {
  const formData = new FormData();
  
  // Append all files with the same key
  files.forEach(file => {
    formData.append("files", file);
  });
  
  formData.append("tag", tag);

  try {
    const response = await fetch(`http://127.0.0.1:8000/upload/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Upload Success:", data);
    setMessage(`✅ ${files.length} image(s) uploaded successfully! Tag: ${tag}`);
    return true;
  } catch (error) {
    console.error("Error uploading files:", error);
    setMessage("❌ Upload failed. Please try again.");
    return false;
  }
};

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [resetImages, setResetImages] = useState(false); // State to reset images

  const handleUpload = async () => {
    if (selectedFiles.length > 0 && tag) {
      const success = await uploadFiles(selectedFiles, tag, setMessage);
      if (success) {
        setTag(""); // Reset tag
        setSelectedFiles([]);
        setResetImages(true);
      }
    } else {
      setMessage("⚠️ Please select at least one file and enter a tag.");
    }
  };

  return (
    <div className="UploadPage">
      {message && <p className="message">{message}</p>}

      <h1 className="Intro">Upload Files</h1>

      <input
        type="text"
        placeholder="Enter tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="tag-input"
      />
      <ImageDropArea
        onFileSelect={setSelectedFiles}
        reset={resetImages}
        onResetComplete={() => setResetImages(false)} // Reset the reset flag
        multiple={true} // Enable multiple file selection
      />

      <button className="uploadbtn" onClick={handleUpload} disabled={selectedFiles.length === 0 || !tag}>
        Upload {selectedFiles.length > 0 ? `(${selectedFiles.length} files)` : ""}
      </button>
    </div>
  );
};

export default UploadPage;
