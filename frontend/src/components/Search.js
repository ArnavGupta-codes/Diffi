// import React from 'react'
// import { useNavigate } from "react-router-dom";

// const Search = () => {
//   const navigate = useNavigate();
//   const goToSearchPage = () => {
//     navigate("/search");
//   };
//   return (
//     <div className="search">
//       <img src="/images/search.png" width="190vw" height="210vh" />
//       <button class="Search-btn" onClick={goToSearchPage}>
//         SEARCH
//       </button>
//     </div>
//   );
// }

// export default Search
import React from 'react'
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Search = () => {
  const navigate = useNavigate();
  const goToSearchPage = () => {
    navigate("/search");
  };
  
  return (
    <motion.div 
      className="search"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="icon-container">
        <motion.img 
          src="/images/search.png" 
          alt="Search icon"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
      </div>
      <h2 className="card-title">Search Questions</h2>
      {/* <p className="card-subtitle">Find questions based on difficulty level or topics</p> */}
      <motion.button 
        className="action-button" 
        onClick={goToSearchPage}
        whileTap={{ scale: 0.95 }}
      >
        Search
      </motion.button>
    </motion.div>
  );
}

export default Search

