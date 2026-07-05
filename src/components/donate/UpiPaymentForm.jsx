import { Check, Copy } from "lucide-react";

export default function UpiPaymentForm({
  activeAmount,
  inrAmount,
  qrCodeUrl,
  copiedAddress,
  upiStatus,
  handleCopyWallet,
  handleUpiPayClick,
}) {
  return (
    <div className="crypto-info-box" style={{ textAlign: "center" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", display: "block", marginBottom: "0.25rem" }}>
        Scan QR Code to Pay via UPI
      </span>
      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "0 0 1.5rem 0" }}>
        Scan using any UPI app (GPay, PhonePe, Paytm, BHIM) to complete your transaction.
      </p>

      {/* QR Code Container with Laser Scanning Effect */}
      <div className="qr-container-box">
        {/* Glowing corners */}
        <div className="qr-corner top-left" />
        <div className="qr-corner top-right" />
        <div className="qr-corner bottom-left" />
        <div className="qr-corner bottom-right" />
        
        {/* Laser Line */}
        <div className="qr-scan-line" />

        {/* Dynamic QR Code Image */}
        <img
          src={qrCodeUrl}
          alt="UPI QR Code"
          style={{
            display: "block",
            margin: "0 auto",
            background: "#fff",
            padding: "10px",
            borderRadius: "12px",
            width: "180px",
            height: "180px",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* QR Code details */}
      <div style={{ marginTop: "1.5rem" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ffmpeg-color)" }}>
          ₹{inrAmount} INR
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "0.35rem" }}>
          (~${activeAmount} USD)
        </span>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--python-color)", display: "block", textAlign: "left", marginBottom: "0.25rem" }}>
          UPI ID
        </span>
        <div className="crypto-wallet-row">
          <span className="crypto-address" style={{ fontWeight: 600 }}>konshu@ptyes</span>
          <button
            type="button"
            className="crypto-copy-btn"
            onClick={() => handleCopyWallet("konshu@ptyes", "upi")}
          >
            {copiedAddress === "upi" ? <Check size={12} style={{ color: "var(--ffmpeg-color)" }} /> : <Copy size={12} />}
            <span>{copiedAddress === "upi" ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Intent Links */}
      <div style={{ marginTop: "1.25rem" }}>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
          On mobile? Tap one of these to pay directly:
        </span>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
            <button
              key={app}
              type="button"
              className="crypto-copy-btn"
              style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              onClick={() => handleUpiPayClick(app)}
            >
              {app}
            </button>
          ))}
        </div>

        {upiStatus && (
          <div
            style={{
              marginTop: "1rem",
              fontSize: "0.75rem",
              color: "var(--ffmpeg-color)",
              background: "rgba(34, 197, 94, 0.05)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              padding: "0.5rem",
              borderRadius: "6px"
            }}
          >
            {upiStatus}
          </div>
        )}
      </div>
    </div>
  );
}
