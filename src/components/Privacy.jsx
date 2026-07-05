import { X, Lock, Database, EyeOff, Terminal } from "lucide-react";
import "./Legal.css";

export default function Privacy({ onClose }) {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <div className="legal-title-section">
          <h1>Privacy Policy</h1>
          <div className="legal-last-updated">Last Updated: July 5, 2026</div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close Privacy Policy">
          <X size={20} />
        </button>
      </div>

      <div className="legal-content">
        <div className="legal-highlight-box">
          <p>
            Your privacy is highly important to us. Tools CLI is designed to operate 
            primarily on the client-side to respect developer privacy and data security.
          </p>
        </div>

        <section className="legal-section">
          <h2>
            <Lock size={18} /> 1. Client-Side Operations
          </h2>
          <p>
            The core philosophy of Tools CLI is to keep all data local. 
            Any interactive builder commands you construct, any terminal simulator inputs you run, 
            and any quiz questions you answer are processed directly inside your browser. 
            No logs, command histories, or configuration inputs are sent to our servers.
          </p>
        </section>

        <section className="legal-section">
          <h2>
            <Database size={18} /> 2. Local Storage Usage
          </h2>
          <p>
            We use browser <code>localStorage</code> solely to store your favorited/bookmarked CLI commands. 
            This data remains entirely on your physical machine and can be deleted at any time 
            by clearing your browser cache or clicking "Remove" next to your favorited commands.
          </p>
        </section>

        <section className="legal-section">
          <h2>
            <EyeOff size={18} /> 3. Third-Party Services & Donation Details
          </h2>
          <p>
            We do not sell, rent, or distribute user information. 
            If you choose to support the project via our Support/Donate panel:
          </p>
          <ul>
            <li><strong>Payment Gateways:</strong> Payment details (credit cards, UPI, PayPal) are processed directly by our secure third-party payment simulators or direct official payment APIs. We do not store financial details.</li>
            <li><strong>Sponsors Wall:</strong> If you elect to show your name/sponsorship on the community Wall, we only display the name and optional public message you provide.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>
            <Terminal size={18} /> 4. Hosting and Log Data
          </h2>
          <p>
            Our website is hosted on secure global static CDN servers. 
            These CDNs may collect standard web logs containing server requests (IP addresses, user agents, referrers) 
            to protect against distributed denial-of-service (DDoS) attacks and ensure network stability. 
            This log data is aggregated and does not map to individual user actions.
          </p>
        </section>

        <section className="legal-section">
          <h2>
            5. Contact Information
          </h2>
          <p>
            If you have questions regarding this privacy policy or our open-source codebase, 
            feel free to open a ticket or pull request on our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
