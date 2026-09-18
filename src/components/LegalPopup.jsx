import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, Check, ShieldAlert } from "lucide-react";
import "./css/LegalPopup.css";

const LegalPopup = () => {
  const location = useLocation();
  const [hasAgreed, setHasAgreed] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem("toolscli_legal_agreed");
    if (agreed === "true") {
      setHasAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("toolscli_legal_agreed", "true");
    setHasAgreed(true);
  };

  // If already agreed, or if currently reading the legal documents/about page, hide the popup overlay
  const isLegalRoute = [
    "/terms",
    "/privacy",
    "/disclaimer",
    "/about",
    "/donate",
    "/",
  ].includes(location.pathname);

  if (hasAgreed || isLegalRoute) return null;

  return (
    <div className="legal-popup-overlay">
      <div className="legal-popup-box">
        <div className="legal-popup-header">
          <ShieldAlert size={28} className="legal-icon" />
          <h2>Welcome to Tools CLI</h2>
        </div>
        <div className="legal-popup-content">
          <p>
            Please take a moment to review our legal policies before using this
            website. By continuing to use this interactive CLI companion, you
            acknowledge that you have read and agreed to the following:
          </p>
          <ul className="legal-links-list">
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/disclaimer">Disclaimer</Link>
            </li>
          </ul>
          <div className="legal-warning">
            <AlertTriangle size={16} />
            <span>
              This platform provides general-purpose commands for educational
              and utility purposes. Always ensure you have authorization before
              running network commands.
            </span>
          </div>
        </div>
        <div className="legal-popup-footer">
          <button className="legal-agree-btn" onClick={handleAgree}>
            <Check size={18} />I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalPopup;
