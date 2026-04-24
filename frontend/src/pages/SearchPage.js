import React, { useState } from "react";
import { motion } from "framer-motion";
import { downloadImage } from "../components/downloadImage";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(
        `${API_URL}/search/?query=${encodeURIComponent(query)}&top_k=${topK}`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imagePath) => {
    const filename = imagePath.split("/").pop();
    const fullUrl = `${API_URL}${imagePath}?t=${Date.now()}`;
    try {
      await downloadImage(fullUrl, filename);
    } catch (error) {
      alert("Failed to download image.");
    }
  };

  return (
    <motion.div
      className="search-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="page-title">Search Questions</h2>
      <p className="page-subtitle">Find questions by topic using semantic search</p>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-row">
          <input
            className="search-input"
            placeholder="Enter topic... e.g. Calculus, Data Structures"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="count-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Count</span>
            <input
              type="number"
              min="1"
              max="100"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              style={{ width: '40px', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', textAlign: 'center', fontSize: '15px' }}
              title="Number of results"
            />
          </div>
          <button className="search-btn" type="submit">
            <i className="fas fa-search"></i> Search
          </button>
        </div>
      </form>

      {loading && <div className="spinner"></div>}

      {!loading && searched && results.length > 0 && (
        <>
          <p className="results-header">{results.length} result{results.length !== 1 ? 's' : ''} found for "{query}"</p>
          <div className="results-grid">
            {results.map((result, index) => (
              <motion.div
                key={index}
                className="img-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setExpandedImage(result)}
              >
                <div className="img-wrapper">
                  <img
                    src={`${API_URL}${result.image_path}?t=${Date.now()}`}
                    alt={result.tag}
                  />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(result.image_path); }}
                  className="download-btn"
                >
                  <i className="fas fa-download"></i> Download
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-search"></i>
          <p>No results found for "{query}". Try a different topic.</p>
        </div>
      )}

      {!searched && !loading && (
        <div className="empty-state">
          <i className="fas fa-images"></i>
          <p>Enter a topic above to search your question bank</p>
        </div>
      )}

      {expandedImage && (
        <div className="modal-overlay" onClick={() => setExpandedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setExpandedImage(null)}>✕</button>
            <img
              src={`${API_URL}${expandedImage.image_path}?t=${Date.now()}`}
              alt={expandedImage.tag}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;
