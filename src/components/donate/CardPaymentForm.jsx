import { CreditCard } from "lucide-react";

export default function CardPaymentForm({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  isFlipped,
  setIsFlipped,
  handleCardNumberChange,
  handleCardNameChange,
  handleExpiryChange,
  handleCvvChange,
  paymentMethod,
}) {
  return (
    <div className="crypto-info-box" style={{ animation: "slide-in var(--transition-fast)" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", display: "block", marginBottom: "1.25rem" }}>
        Enter Credit Card Details
      </span>

      {/* Gorgeous Holographic Mock Card with 3D Flip */}
      <div className={`card-container-3d ${isFlipped ? "flipped" : ""}`}>
        <div className="card-inner-3d">
          
          {/* Card Front Side */}
          <div className="interactive-card-mockup card-front-3d">
            <div className="mockup-card-chip" />
            <div className="mockup-card-number">
              {cardNumber || "•••• •••• •••• ••••"}
            </div>
            <div className="mockup-card-bottom">
              <div className="mockup-card-holder">
                <span className="mockup-card-label">CARDHOLDER</span>
                <span className="mockup-card-val">{cardName || "CARDHOLDER NAME"}</span>
              </div>
              <div className="mockup-card-expiry">
                <span className="mockup-card-label">EXPIRES</span>
                <span className="mockup-card-val">{cardExpiry || "MM/YY"}</span>
              </div>
            </div>
          </div>

          {/* Card Back Side */}
          <div className="interactive-card-mockup card-back-3d">
            <div className="card-back-magnetic-strip" />
            <div className="card-back-cvv-section">
              <span className="card-back-cvv-label">CVV</span>
              <div className="card-back-cvv-box">
                {cardCvv || "•••"}
              </div>
            </div>
            <div className="card-back-logo">
              <CreditCard size={24} style={{ opacity: 0.25 }} />
            </div>
          </div>

        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="form-grid" style={{ marginTop: "1.5rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            className="form-input"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required={paymentMethod === "card"}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            placeholder="NAME ON CARD"
            className="form-input"
            value={cardName}
            onChange={handleCardNameChange}
            required={paymentMethod === "card"}
          />
        </div>
      </div>

      <div className="form-grid" style={{ marginTop: "1rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="cardExpiry">Expiration Date</label>
          <input
            type="text"
            id="cardExpiry"
            placeholder="MM/YY"
            className="form-input"
            value={cardExpiry}
            onChange={handleExpiryChange}
            required={paymentMethod === "card"}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="cardCvv">CVV</label>
          <input
            type="password"
            id="cardCvv"
            placeholder="•••"
            className="form-input"
            value={cardCvv}
            onChange={handleCvvChange}
            onFocus={() => setIsFlipped(true)}
            onBlur={() => setIsFlipped(false)}
            required={paymentMethod === "card"}
          />
        </div>
      </div>
    </div>
  );
}
