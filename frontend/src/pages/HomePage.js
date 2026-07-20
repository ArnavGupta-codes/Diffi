import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Upload from '../components/Upload';
import Search from '../components/Search';

const faqData = [
  {
    question: "How does the semantic search work?",
    answer: "We use a HuggingFace sentence transformer to convert your text queries and image tags into dense vector embeddings. These are then searched using FAISS (Facebook AI Similarity Search) to find the most conceptually related questions, going far beyond simple keyword matching."
  },
  {
    question: "Can I upload handwritten questions?",
    answer: "Yes! Our platform supports image uploads, so you can easily take a picture of handwritten notes or exam papers and upload them directly."
  },
  {
    question: "Is there a limit to how many questions I can upload?",
    answer: "There are currently no strict limits on uploads. You can batch upload multiple images at once and assign a common topic tag to all of them to save time."
  },
  {
    question: "Who can see the questions I upload?",
    answer: "Diffi is designed as a collaborative platform. Questions you upload are indexed globally so that anyone studying similar topics can benefit from your contributions."
  }
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      className="faq-item"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {faq.question}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="faq-answer"
          >
            {faq.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <i className="fas fa-bolt"></i> Intelligent Question Bank
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Organize & Search
          <br />
          <span className="gradient-text">Questions Intelligently</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload exam questions, tag them by topic, and retrieve them instantly
          using semantic similarity search.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="btn-primary" onClick={() => navigate('/upload')}>
            <i className="fas fa-cloud-upload-alt"></i> Upload Questions
          </button>
          <button className="btn-secondary" onClick={() => navigate('/search')}>
            <i className="fas fa-search"></i> Search Questions
          </button>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="stats-row">
        {[
          { value: 'FAISS', label: 'Vector Database' },
          { value: 'AI', label: 'Semantic Search' },
          { value: '∞', label: 'Questions Supported' },
          { value: 'Real-time', label: 'Results' },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Feature Cards */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            A complete platform for managing and retrieving exam questions efficiently
          </p>
        </div>
        <div className="features-grid">
          {[
            { icon: 'fa-brain', title: 'Intelligent Search', desc: 'Uses HuggingFace embeddings and FAISS for semantic search beyond simple keyword matching.' },
            { icon: 'fa-images', title: 'Bulk Upload', desc: 'Upload multiple question images at once with a single tag — perfect for exam preparation.' },
            { icon: 'fa-users', title: 'Collaborative', desc: 'Access questions uploaded by anyone on the platform for a shared question bank experience.' },
            { icon: 'fa-download', title: 'Easy Download', desc: 'Download individual question images directly to your device with one click.' },
            { icon: 'fa-tags', title: 'Smart Tagging', desc: 'Tag questions by topic for organized categorization and easy retrieval.' },
            { icon: 'fa-rocket', title: 'Lightning Fast', desc: 'FAISS vector search delivers results in milliseconds, no matter how large your question bank.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon"><i className={`fas ${f.icon}`}></i></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Access Cards */}
      <div className="home-cards">
        <Upload />
        <Search />
      </div>

      {/* How It Works */}
      <section className="how-section">
        <div className="section-header">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Three Simple Steps</h2>
        </div>
        <div className="how-grid">
          {[
            { num: '1', title: 'Upload', desc: 'Drag & drop question images and assign a topic tag' },
            { num: '2', title: 'Index', desc: 'Our AI creates vector embeddings and stores them in FAISS' },
            { num: '3', title: 'Search', desc: 'Enter a topic query and get semantically similar questions instantly' },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="how-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="step-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
