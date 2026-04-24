import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Search = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="home-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      whileHover={{ y: -6 }}
    >
      <div className="card-icon">
        <img src="/images/search.png" alt="Search" />
      </div>
      <h3>Search Questions</h3>
      <p>Find questions instantly using intelligent semantic search across your entire bank</p>
      <button className="btn-primary" onClick={() => navigate('/search')}>
        <i className="fas fa-search"></i> Search Now
      </button>
    </motion.div>
  );
};

export default Search;
