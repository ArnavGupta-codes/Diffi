import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { downloadImage } from "../components/downloadImage";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState("");
  const [results, setResults] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/search/?query=${query}&top_k=${topK}`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleDownload = async (imagePath) => {
    const filename = imagePath.split("/").pop();
    const fullUrl = `http://127.0.0.1:8000${imagePath}?t=${new Date().getTime()}`;

    try {
      await downloadImage(fullUrl, filename);
    } catch (error) {
      console.error("Error in download:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const openExpandedView = (image) => {
    setExpandedImage(image);
  };

  const closeExpandedView = () => {
    setExpandedImage(null);
  };

  return (
    <div className="SearchPage">
      <form className="form" onSubmit={handleSearch}>
        <input
          className="search_bar"
          id="Topic"
          placeholder="Enter Topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="inner-search">
          <input
            type="number"
            className="NoQ"
            placeholder="No. of questions"
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
          />
          <button className="submit_button" type="submit">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </button>
        </div>
      </form>

      <div className="outer-img-container">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="img-card" onClick={() => openExpandedView(result)}>
              <div className="img-wrapper">
                <img
                  src={`http://127.0.0.1:8000${result.image_path}?t=${new Date().getTime()}`}
                  alt={result.tag}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent image from expanding when clicking button
                    handleDownload(result.image_path);
                  }}
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>

      {/* Expanded Image Modal with Close Button */}
      {expandedImage && (
        <div className="modal-overlay" onClick={closeExpandedView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeExpandedView}>✖</button>
            <img className="image-expanded"
              src={`http://127.0.0.1:8000${expandedImage.image_path}?t=${new Date().getTime()}`}
              alt={expandedImage.tag}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
