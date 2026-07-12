import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Gift,
  X,
  CreditCard,
  DollarSign,
  User,
  Coffee,
} from "lucide-react";
import CardPaymentForm from "./donate/CardPaymentForm";
import UpiPaymentForm from "./donate/UpiPaymentForm";
import PaymentSimulator from "./donate/PaymentSimulator";
import BackerCertificate from "./donate/BackerCertificate";
import SponsorWall from "./donate/SponsorWall";
import "./css/Donate.css";

const PRESETS = [
  { amount: 5, label: "Buy a Coffee ☕", desc: "Support ongoing hosting" },
  { amount: 15, label: "Backer Tier 🛡️", desc: "Recognized on sponsors wall" },
  { amount: 25, label: "Power User 🚀", desc: "Full backer certificate" },
  {
    amount: 50,
    label: "Developer Tier ⭐",
    desc: "Special recognition + certificate",
  },
  {
    amount: 100,
    label: "Sponsor Master 👑",
    desc: "Featured spotlight backer",
  },
];

const PAYMENT_METHODS = [
  { id: "card", name: "Credit Card", icon: <CreditCard size={20} /> },
  { id: "paypal", name: "PayPal", icon: <DollarSign size={20} /> },
  { id: "upi", name: "UPI / QR Code", icon: <CreditCard size={20} /> }, // Temporary replacement icon or similar if QrCode not in parent
  // { id: "bmac", name: "Buy Me a Coffee", icon: <Coffee size={20} /> },
];

// Map QrCode icon or keep parent list clean
import { QrCode } from "lucide-react";
PAYMENT_METHODS[2].icon = <QrCode size={20} />;

//  {
//     name: "Alex Mercer",
//     amount: "$50",
//     message:
//       "Thanks for creating this! The interactive FFmpeg command builder is an absolute lifesaver.",
//     date: "June 18, 2026",
//   },

// const MOCK_SPONSORS_DATA = [
//   {
//     name: "Alex Mercer",
//     amount: "$50",
//     message:
//       "Thanks for creating this! The interactive FFmpeg command builder is an absolute lifesaver.",
//     date: "June 18, 2026",
//   },
//   {
//     name: "Sophia Chen",
//     amount: "$25",
//     message:
//       "Local AI integration details are extremely helpful. Keep up the amazing work!",
//     date: "June 14, 2026",
//   },
//   {
//     name: "CLI Fanatic",
//     amount: "$15",
//     message:
//       "Clean, fast, and gorgeous UI. Love the local terminal simulation!",
//     date: "June 10, 2026",
//   },
//   {
//     name: "Anonymous Sponsor",
//     amount: "$100",
//     message: "Supporting excellent open-source documentation.",
//     date: "June 03, 2026",
//   },
// ];
const MOCK_SPONSORS = [];

export default function Donate({ onClose }) {
  const [sponsorType, setSponsorType] = useState("one-time");
  const [amountType, setAmountType] = useState("preset");
  const [selectedPreset, setSelectedPreset] = useState(15);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState("");
  const [upiStatus, setUpiStatus] = useState("");

  // Card details states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const simulationSteps = useMemo(
    () => [
      { type: "info", text: "Initializing payment gateway API connection..." },
      { type: "info", text: "Connecting to secure bank verification host..." },
      {
        type: "info",
        text: `Constructing payload: Type = ${sponsorType.toUpperCase()}, Method = ${paymentMethod.toUpperCase()}`,
      },
      { type: "info", text: `Transmitting sponsor data package securely...` },
      {
        type: "warn",
        text: "Performing multi-factor anti-fraud verification check...",
      },
      { type: "info", text: "Transaction authorized by provider gateway!" },
      {
        type: "success",
        text: "Generating digital backer cryptographic certificate...",
      },
      {
        type: "success",
        text: "Finalizing donation record. Sponsor Wall updated.",
      },
      { type: "success", text: "Done! Thank you so much for your support." },
    ],
    [sponsorType, paymentMethod],
  );

  useEffect(() => {
    let timer;
    if (isSimulating && simulationIndex < simulationSteps.length) {
      timer = setTimeout(() => {
        setSimulationLogs((prev) => [
          ...prev,
          simulationSteps[simulationIndex],
        ]);
        setSimulationIndex((prev) => prev + 1);
      }, 700);
    } else if (isSimulating && simulationIndex === simulationSteps.length) {
      timer = setTimeout(() => {
        setIsSimulating(false);
        setIsSuccess(true);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, simulationIndex, simulationSteps]);

  const activeAmount =
    amountType === "preset" ? selectedPreset : parseFloat(customAmount) || 0;
  const inrAmount = (activeAmount * 83).toFixed(2);
  const upiUrl = `upi://pay?pa=konshu@ptyes&pn=kOnshuPlant&am=${inrAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyWallet = (address, key) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(key);
    setTimeout(() => setCopiedAddress(""), 2000);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(" ") : "";
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const handleCardNameChange = (e) => {
    setCardName(e.target.value.toUpperCase());
  };

  const handleUpiPayClick = (app) => {
    let scheme;
    switch (app) {
      case "GPay":
        scheme = `tez://upi/pay?pa=konshu@ptyes&pn=kOnshuPlant&am=${inrAmount}&cu=INR`;
        break;
      case "PhonePe":
        scheme = `phonepe://pay?pa=konshu@ptyes&pn=kOnshuPlant&am=${inrAmount}&cu=INR`;
        break;
      case "Paytm":
        scheme = `paytmmp://pay?pa=konshu@ptyes&pn=kOnshuPlant&am=${inrAmount}&cu=INR`;
        break;
      case "BHIM":
        scheme = `bhim://pay?pa=konshu@ptyes&pn=kOnshuPlant&am=${inrAmount}&cu=INR`;
        break;
      default:
        scheme = `upi://pay?pa=konshu@ptyes&pn=kOnshuPlant&am=${inrAmount}&cu=INR`;
    }

    setUpiStatus(`Opening ${app}... Please complete payment in the app.`);
    setTimeout(() => setUpiStatus(""), 6000);

    try {
      const link = document.createElement("a");
      link.href = scheme;
      link.click();
    } catch (err) {
      console.warn("Direct protocol link redirection failed:", err);
    }
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    if (activeAmount <= 0) return;
    setIsSimulating(true);
    setSimulationIndex(0);
    setSimulationLogs([]);
  };

  const triggerMockCertificateDownload = () => {
    alert("Digital Backer Certificate downloaded! (Simulated)");
  };

  return (
    <div className="donate-panel-overlay">
      <div className="donate-container">
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "6px",
            transition: "all var(--transition-fast)",
            display: "inline-flex",
            alignItems: "center",
          }}
          title="Close Page"
          className="hover-accent"
        >
          <X size={22} />
        </button>

        {!isSimulating && !isSuccess ? (
          <>
            <div className="donate-header">
              <div className="donate-heart-icon">
                <Heart size={42} fill="currentColor" />
              </div>
              <h2 className="donate-title">Support Tools CLI</h2>
              <p className="donate-tagline">
                Tools CLI is free and open-source. Your contribution keeps the
                servers running, updates the cheat sheets, and empowers
                developer education worldwide.
              </p>
            </div>

            <form onSubmit={handleDonateSubmit}>
              {/* Type Select */}
              <div className="donate-section-title">
                <Gift size={16} style={{ color: "var(--ollama-color)" }} />
                Select Frequency
              </div>
              <div className="donate-type-selector">
                <div
                  className={`donate-type-card ${sponsorType === "one-time" ? "active" : ""}`}
                  onClick={() => setSponsorType("one-time")}
                >
                  <span className="donate-type-name">One-time Donation</span>
                  <span className="donate-type-desc">Support us today</span>
                </div>
                <div
                  className={`donate-type-card ${sponsorType === "monthly" ? "active" : ""}`}
                  onClick={() => setSponsorType("monthly")}
                >
                  <span className="donate-type-name">Monthly Sponsor</span>
                  <span className="donate-type-desc">
                    Support sustainable development
                  </span>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="donate-section-title">
                <DollarSign
                  size={16}
                  style={{ color: "var(--ffmpeg-color)" }}
                />
                Select Amount
              </div>
              <div className="donate-presets-grid">
                {PRESETS.map((preset) => (
                  <div
                    key={preset.amount}
                    className={`donate-preset-card ${amountType === "preset" && selectedPreset === preset.amount ? "active" : ""}`}
                    onClick={() => {
                      setAmountType("preset");
                      setSelectedPreset(preset.amount);
                    }}
                  >
                    <span className="donate-preset-amount">
                      ${preset.amount}
                    </span>
                    <span className="donate-preset-label">{preset.label}</span>
                  </div>
                ))}
                <div
                  className={`donate-preset-card ${amountType === "custom" ? "active" : ""}`}
                  onClick={() => setAmountType("custom")}
                >
                  <span className="donate-preset-amount">Custom</span>
                  <span className="donate-preset-label">Specify amount</span>
                </div>
              </div>

              {/* Custom Amount input */}
              {amountType === "custom" && (
                <div className="custom-amount-container">
                  <span className="custom-amount-prefix">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Custom Amount"
                    className="custom-amount-input"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Donor Details */}
              <div className="donate-section-title">
                <User size={16} style={{ color: "var(--python-color)" }} />
                Backer Profile Info
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="donorName">
                    Name
                  </label>
                  <input
                    type="text"
                    id="donorName"
                    placeholder="e.g. John Doe"
                    className="form-input"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    disabled={isAnonymous}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="donorEmail">
                    Email (Secret)
                  </label>
                  <input
                    type="email"
                    id="donorEmail"
                    placeholder="e.g. email@provider.com"
                    className="form-input"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" htmlFor="donorMessage">
                  Encouragement Message (Optional)
                </label>
                <textarea
                  id="donorMessage"
                  placeholder="Share how Tools CLI has helped you, or say something nice!"
                  className="form-textarea"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  maxLength={250}
                />
              </div>

              <div style={{ marginBottom: "2rem", display: "flex" }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) setDonorName("Anonymous Sponsor");
                      else setDonorName("");
                    }}
                  />
                  <span>Donate anonymously (Hide name from Sponsors Wall)</span>
                </label>
              </div>

              {/* Payment Methods */}
              <div className="donate-section-title">
                <CreditCard size={16} style={{ color: "var(--utils-color)" }} />
                Select Payment Gateway
              </div>
              <div className="payment-grid">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-card ${paymentMethod === method.id ? "active" : ""}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div
                      style={{
                        color:
                          paymentMethod === method.id
                            ? "var(--ollama-color)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {method.icon}
                    </div>
                    <span className="payment-card-name">{method.name}</span>
                  </div>
                ))}
              </div>

              {/* If Credit Card selected, show Card Inputs */}
              {paymentMethod === "card" && (
                <CardPaymentForm
                  cardNumber={cardNumber}
                  cardName={cardName}
                  cardExpiry={cardExpiry}
                  cardCvv={cardCvv}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                  handleCardNumberChange={handleCardNumberChange}
                  handleCardNameChange={handleCardNameChange}
                  handleExpiryChange={handleExpiryChange}
                  handleCvvChange={handleCvvChange}
                  paymentMethod={paymentMethod}
                />
              )}

              {paymentMethod === "upi" && (
                <UpiPaymentForm
                  activeAmount={activeAmount}
                  inrAmount={inrAmount}
                  qrCodeUrl={qrCodeUrl}
                  copiedAddress={copiedAddress}
                  upiStatus={upiStatus}
                  handleCopyWallet={handleCopyWallet}
                  handleUpiPayClick={handleUpiPayClick}
                />
              )}

              {/* Submit Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "2rem",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="quiz-reset-btn"
                  style={{ padding: "0.75rem 2rem", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="quiz-next-btn"
                  style={{
                    padding: "0.75rem 2.5rem",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  disabled={activeAmount <= 0}
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Donate ${activeAmount}</span>
                </button>
              </div>
            </form>

            {/* Wall of Sponsors */}
            <SponsorWall sponsors={MOCK_SPONSORS} />
          </>
        ) : isSimulating ? (
          <PaymentSimulator logs={simulationLogs} />
        ) : (
          <BackerCertificate
            donorName={donorName}
            activeAmount={activeAmount}
            onClose={onClose}
            onDownload={triggerMockCertificateDownload}
          />
        )}
      </div>
    </div>
  );
}
