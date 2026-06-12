import React, { useState } from 'react';
import { quizQuestions } from '../data/toolsData';
import { Award, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import './Quiz.css';

export default function Quiz({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    setSelectedOpt(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedOpt === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const getRank = (score) => {
    if (score === 5) return { title: 'Terminal Master (root)', desc: 'You have complete command over the shell! Superuser status achieved.' };
    if (score >= 3) return { title: 'Power User (sudo)', desc: 'Excellent CLI skills. You navigate environments with ease and confidence.' };
    return { title: 'User (guest)', desc: 'Good start! Spend more time experimenting with interactive builders to master flags.' };
  };

  const progressPercent = ((currentIdx) / quizQuestions.length) * 100;
  const finalProgress = showResults ? 100 : progressPercent;

  return (
    <div className="quiz-panel-overlay">
      <div className="quiz-container">
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px'
          }}
          title="Exit Quiz"
        >
          <X size={20} />
        </button>

        {!showResults ? (
          <>
            <div className="quiz-header">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ollama-color)' }}>
                CLI Challenge
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Question {currentIdx + 1} of {quizQuestions.length}
              </span>
            </div>

            <div className="quiz-progress-bar-bg">
              <div className="quiz-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <h3 className="quiz-question">{currentQuestion.question}</h3>

            <div className="quiz-options-list">
              {currentQuestion.options.map((opt, i) => {
                let cardClass = 'quiz-option-card';
                if (selectedOpt === opt) cardClass += ' selected';
                
                if (isAnswered) {
                  if (opt === currentQuestion.answer) {
                    cardClass += ' correct';
                  } else if (selectedOpt === opt) {
                    cardClass += ' incorrect';
                  }
                }

                return (
                  <div 
                    key={opt} 
                    className={cardClass}
                    onClick={() => handleOptionSelect(opt)}
                  >
                    <span className="option-letter">{optionLetters[i]}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isAnswered && opt === currentQuestion.answer && <CheckCircle size={16} style={{ color: 'var(--ffmpeg-color)' }} />}
                    {isAnswered && selectedOpt === opt && opt !== currentQuestion.answer && <AlertCircle size={16} style={{ color: 'var(--ytdlp-color)' }} />}
                  </div>
                );
              })}
            </div>

            {isAnswered && (
              <div className="quiz-explanation-box">
                <h4>
                  <CheckCircle size={15} /> Explanation
                </h4>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="quiz-actions">
              {!isAnswered ? (
                <button 
                  className="quiz-next-btn"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  style={{ opacity: selectedOpt === null ? 0.5 : 1 }}
                >
                  Submit Answer
                </button>
              ) : (
                <button className="quiz-next-btn" onClick={handleNext}>
                  {currentIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="quiz-score-page">
            <div className="quiz-progress-bar-bg">
              <div className="quiz-progress-bar-fill" style={{ width: '100%' }} />
            </div>
            
            <div className="score-circle">
              <span className="score-num">{score}</span>
              <span className="score-total">/ {quizQuestions.length}</span>
            </div>

            <h3 className="quiz-results-title">Quiz Completed!</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'var(--accent-glow)',
                color: 'var(--accent-color)',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {getRank(score).title}
              </span>
            </div>
            <p className="quiz-results-desc">{getRank(score).desc}</p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="quiz-reset-btn" onClick={handleRestart}>
                <RefreshCw size={15} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Try Again
              </button>
              <button 
                className="quiz-next-btn" 
                onClick={onClose}
              >
                Back to Tools
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
