import { Link } from "react-router-dom";
import { GithubIcon } from "./icons";
import { Terminal, Heart } from "lucide-react";
import "./css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Terminal size={18} style={{ color: "var(--accent-color)" }} />
          <span className="footer-logo-text">TOOLS CLI</span>
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              marginLeft: "0.5rem",
            }}
          >
            v1.0.0-Beta
          </span>
        </div>

        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} konshu.in Built with React & Vite.
          Released under the MIT License.
        </p>

        <div className="footer-links">
          <Link to="/about" className="hover-accent">
            About
          </Link>
          <span>|</span>
          <Link to="/terms" className="hover-accent">
            Terms
          </Link>
          <span>|</span>
          <Link to="/privacy" className="hover-accent">
            Privacy
          </Link>
          <span>|</span>
          <Link
            to="/donate"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
            className="hover-accent"
          >
            <Heart size={14} style={{ color: "var(--ytdlp-color)" }} />
            Donate
          </Link>
          <span>|</span>
          <a
            href="https://github.com/karan-k-code/tools-cli"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <GithubIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
