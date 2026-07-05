import { Award } from "lucide-react";

export default function SponsorWall({ sponsors }) {
  const sponsorsList = Array.isArray(sponsors) ? sponsors : [];

  return (
    <div className="sponsors-wall">
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>
        Sponsor Wall of Fame
      </h3>
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.25rem 0 1.25rem 0" }}>
        Thank you to our latest developers and backers who make this possible.
      </p>
      {sponsorsList.length === 0 ? (
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px dashed var(--border-color)",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
          }}
        >
          0 sponsors
        </div>
      ) : (
        <div className="sponsors-grid">
          {sponsorsList.map((sp, idx) => (
            <div key={idx} className="sponsor-card">
              <div className="sponsor-card-header">
                <span className="sponsor-name">
                  <Award size={14} style={{ color: "var(--utils-color)" }} />
                  {sp.name}
                </span>
                <span className="sponsor-amount">{sp.amount}</span>
              </div>
              <p className="sponsor-message">"{sp.message}"</p>
              <span className="sponsor-date">{sp.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
