import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Upload = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="home-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
    >
      <div className="card-icon">
        <img src="/images/upload.png" alt="Upload" />
      </div>
      <h3>Upload Questions</h3>
      <p>Upload question images with tags for intelligent categorization and retrieval</p>
      <button className="btn-primary" onClick={() => navigate('/upload')}>
        <i className="fas fa-cloud-upload-alt"></i> Upload Now
      </button>
    </motion.div>
  );
};

export default Upload;
