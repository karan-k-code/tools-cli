import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, ShieldAlert } from "lucide-react";
import "./css/LegalPopup.css";

const LegalPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("toolscli_legal_agreed");
    if (!hasAgreed) {
      setIsVisible(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("toolscli_legal_agreed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="legal-popup-overlay">
      <div className="legal-popup-box">
        <div className="legal-popup-header">
          <ShieldAlert size={28} className="legal-icon" />
          <h2>Welcome to Tools CLI</h2>
        </div>
        <div className="legal-popup-content">
          <p>
            Please take a moment to review our legal policies before using this website. 
            By continuing to use this interactive CLI companion, you acknowledge that you have read and agreed to the following:
          </p>
          <ul className="legal-links-list">
            <li>
              <Link to="/terms" onClick={() => setIsVisible(false)}>
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" onClick={() => setIsVisible(false)}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" onClick={() => setIsVisible(false)}>
                Disclaimer
              </Link>
            </li>
          </ul>
          <div className="legal-warning">
            <AlertTriangle size={16} />
            <span>
              This platform provides general-purpose commands for educational and utility purposes. Always ensure you have authorization before running network commands.
            </span>
          </div>
        </div>
        <div className="legal-popup-footer">
          <button className="legal-agree-btn" onClick={handleAgree}>
            <Check size={18} />
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalPopup;
