import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const techStack = [
    { icon: 'fas fa-bolt', name: 'FastAPI' },
    { icon: 'fas fa-database', name: 'FAISS' },
    { icon: 'fas fa-robot', name: 'HuggingFace' },
    { icon: 'fab fa-react', name: 'React.js' },
    { icon: 'fas fa-palette', name: 'Framer Motion' },
    { icon: 'fas fa-server', name: 'Uvicorn' },
  ];

  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2>About DiffiScore</h2>
      <p>
        DiffiScore is a question bank platform that enables educators and students
        to upload exam questions, tag them by topic, and retrieve them instantly using semantic
        similarity search powered by FAISS and HuggingFace embeddings.
      </p>
      <p>
        Unlike traditional keyword-based search, DiffiScore understands the meaning behind your queries.
        Search for "derivatives" and it will find questions about calculus, differentiation, and related topics —
        even if those exact words don't appear in the tags.
      </p>

      <h2>Tech Stack</h2>
      <div className="tech-grid">
        {techStack.map((tech, i) => (
          <motion.div
            key={i}
            className="tech-item"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <i className={tech.icon}></i>
            <span>{tech.name}</span>
          </motion.div>
        ))}
      </div>

      <h2>Links</h2>
      <p>
        <a href="https://github.com/Tanay-sheth/Diffi" target="_blank" rel="noreferrer" style={{color:'var(--text-secondary)'}}>
          <i className="fab fa-github"></i> GitHub Repository
        </a>
      </p>
    </motion.div>
  );
};

export default AboutPage;
