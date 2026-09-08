import { Check, Download } from "lucide-react";

export default function BackerCertificate({ donorName, activeAmount, activeUsdAmount, currencySymbol = "$", onClose, onDownload }) {
  return (
    <div className="donate-success-card">
      <div className="success-badge-container">
        <Check size={40} style={{ color: "var(--ffmpeg-color)" }} />
      </div>
      <h3 className="success-title">Thank You for Your Support!</h3>
      <p className="success-subtitle">
        Your transaction has processed successfully. Below is your official sponsor credential.
      </p>

      <div className="sponsorship-certificate">
        <div className="certificate-header">Certificate of Appreciation</div>
        <div className="certificate-title">Tools CLI Backer</div>
        <div className="certificate-recipient">
          {donorName || "Honorable Backer"}
        </div>
        <p className="certificate-details">
          For contribution of <strong>{currencySymbol}{activeAmount}</strong> to the development of Tools CLI. Your support aids the promotion of open-source CLI learning systems.
        </p>
        <div className="certificate-meta">
          <div className="certificate-meta-item">
            <strong>DATE</strong>
            <span>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="certificate-meta-item">
            <strong>TIER</strong>
            <span>{(activeUsdAmount || activeAmount) >= 100 ? "Gold Sponsor" : (activeUsdAmount || activeAmount) >= 50 ? "Platinum Backer" : (activeUsdAmount || activeAmount) >= 25 ? "Developer Backer" : "Supporter"}</span>
          </div>
          <div className="certificate-meta-item">
            <strong>SIGNATURE</strong>
            <span style={{ fontFamily: "cursive", color: "var(--ollama-color)" }}>Tools CLI Core</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          type="button"
          className="quiz-reset-btn"
          onClick={onDownload}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Download size={16} />
          <span>Download PDF</span>
        </button>
        <button type="button" className="quiz-next-btn" onClick={onClose}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
