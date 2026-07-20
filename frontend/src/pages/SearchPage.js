import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { downloadImage } from "../components/downloadImage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const SearchResultPost = ({ result, index, handleDownload }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [votes, setVotes] = useState(result.votes || 0);
  const [views] = useState(Math.floor(Math.random() * 500) + 50); // Mock views
  const [userVote, setUserVote] = useState(null); // 'upvote' or 'downvote'

  const handleVote = async (action) => {
    if (!result.id) {
        alert("Cannot vote on this post (missing ID)");
        return;
    }
    if (userVote === action) return; // already voted this way
    
    // Optimistic update
    const diff = action === 'upvote' ? 1 : -1;
    const oldVoteDiff = userVote === 'upvote' ? -1 : (userVote === 'downvote' ? 1 : 0);
    setVotes(prev => prev + diff + oldVoteDiff);
    setUserVote(action);

    try {
      const response = await fetch(`${API_URL}/vote/${result.id}?action=${action}`, { method: 'POST' });
      if (!response.ok) {
          throw new Error("Vote failed");
      }
    } catch (err) {
      console.error("Vote failed", err);
      // Revert on error
      setVotes(prev => prev - diff - oldVoteDiff);
      setUserVote(null);
    }
  };

  return (
    <motion.div
      className="so-post"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="so-stats">
        <div className="so-stat vote-controls">
          <button className={`vote-btn ${userVote === 'upvote' ? 'active-up' : ''}`} onClick={() => handleVote('upvote')} title="Upvote">
             <i className="fas fa-caret-up"></i>
          </button>
          <span className="stat-num">{votes}</span>
          <button className={`vote-btn ${userVote === 'downvote' ? 'active-down' : ''}`} onClick={() => handleVote('downvote')} title="Downvote">
             <i className="fas fa-caret-down"></i>
          </button>
        </div>
        <div className="so-stat">
          <span className="stat-num" style={{ color: "var(--success-color)" }}>1</span>
          <span className="stat-label">answer</span>
        </div>
        <div className="so-stat views">
          <span className="stat-num">{views}</span>
          <span className="stat-label">views</span>
        </div>
      </div>
      
      <div className="so-content">
        <h3 className="so-title">Question related to: {result.tag}</h3>
        <div className="so-image-wrapper">
          <img
            src={`${API_URL}${result.image_path}?t=${Date.now()}`}
            alt={result.tag}
            className="so-image"
          />
        </div>
        
        {result.answer && (
          <div className="so-answer-section">
            <button 
              className="btn-secondary reveal-btn" 
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? "Hide Answer" : "Reveal Answer"}
            </button>
            {showAnswer && (
              <motion.div 
                className="so-answer-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <strong>Solution:</strong>
                <p>{result.answer}</p>
              </motion.div>
            )}
          </div>
        )}
        
        <div className="so-footer">
          <div className="so-tags">
            <span className="so-tag">{result.tag}</span>
            <span className="so-tag">practice</span>
          </div>
          <div className="so-actions">
            <button
              onClick={() => handleDownload(result.image_path)}
              className="btn-download-sm"
            >
              <i className="fas fa-download"></i> Save
            </button>
            <div className="so-author">
              <div className="author-avatar"></div>
              <span>Student_{Math.floor(Math.random() * 1000)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");

  const fetchResults = async (sortValue = sortBy) => {
    if (!query) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/search/?query=${encodeURIComponent(query)}&top_k=${parseInt(topK, 10) || 5}&sort_by=${sortValue}`
      );
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch results. Make sure the backend is running.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const handleSortChange = (newSort) => {
      setSortBy(newSort);
      fetchResults(newSort);
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
              onChange={(e) => setTopK(parseInt(e.target.value, 10) || 1)}
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

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {!loading && searched && results.length > 0 && (
        <div className="so-feed-container">
          <div className="so-feed-header">
            <h3>{results.length} result{results.length !== 1 ? 's' : ''} found</h3>
            <div className="so-feed-filters">
              <span className={sortBy === "relevance" ? "active" : ""} onClick={() => handleSortChange("relevance")}>Relevance</span>
              <span className={sortBy === "newest" ? "active" : ""} onClick={() => handleSortChange("newest")}>Newest</span>
              <span className={sortBy === "most_voted" ? "active" : ""} onClick={() => handleSortChange("most_voted")}>Most Voted</span>
            </div>
          </div>
          <div className="so-feed">
            {results.map((result, index) => (
              <SearchResultPost 
                key={index} 
                result={result} 
                index={index} 
                handleDownload={handleDownload} 
              />
            ))}
          </div>
        </div>
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
