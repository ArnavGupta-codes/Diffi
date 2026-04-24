import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

const ImageDropArea = ({ onFileSelect, reset, onResetComplete }) => {
  const [images, setImages] = useState([]);
  const activeUrls = React.useRef([]);

  useEffect(() => {
    const files = images.map(img => img.file);
    onFileSelect(files);
  }, [images, onFileSelect]);

  useEffect(() => {
    if (reset) {
      setImages([]);
      onResetComplete();
    }
  }, [reset, onResetComplete]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const preview = URL.createObjectURL(file);
      activeUrls.current.push(preview);
      return { file, preview };
    });
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: true,
  });

  useEffect(() => {
    return () => {
      activeUrls.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="dropzone-container">
      <div
        {...getRootProps()}
        className={`drag-and-drop ${isDragActive ? "drag-active" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="upload-icon" />
        <p className="drag-text">
          {isDragActive
            ? "Drop your images here..."
            : "Drag and drop images here, or click to upload"}
        </p>
        {images.length > 0 && (
          <p className="file-count">{images.length} file(s) selected</p>
        )}
      </div>
      <div className="image-preview-container">
        {images.map((image, index) => (
          <div key={index} className="image-preview">
            <img src={image.preview} alt={`Preview ${index}`} className="preview-img" />
            <button className="remove-btn" onClick={() => removeImage(index)}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDropArea;
