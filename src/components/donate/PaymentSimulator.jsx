export default function PaymentSimulator({ logs }) {
  return (
    <div className="donate-simulation">
      <div className="spinner-container">
        <div className="spinner-outer" />
        <div className="spinner-inner" />
      </div>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
        Verifying Sponsor Pipeline
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        Establishing a secure connection to process your payment...
      </p>

      <div className="simulation-terminal">
        {logs.map((log, idx) => (
          <div key={idx} className={`terminal-line ${log.type}`}>
            <span>&gt;</span>
            <span>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
