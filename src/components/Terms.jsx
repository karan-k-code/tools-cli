import { X, Scale, Shield, HelpCircle, Terminal } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import "./css/Legal.css";

export default function Terms({ onClose }) {
  useSEO({
    title: "Terms of Service - Tools Cli",
    description: "Review the Terms of Service and guidelines for using the Tools Cli interactive CLI dashboard.",
    path: "terms"
  });

  return (
    <div className="legal-container">
      <div className="legal-header">
        <div className="legal-title-section">
          <h1>Terms of Service</h1>
          <div className="legal-last-updated">Last Updated: July 5, 2026</div>
        </div>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close Terms"
        >
          <X size={20} />
        </button>
      </div>

      <div className="legal-content">
        <div className="legal-highlight-box">
          <p>
            Welcome to Tools CLI! By accessing or using our interactive CLI
            dashboard, you agree to be bound by these terms. Please read them
            carefully.
          </p>
        </div>

        <section className="legal-section">
          <h2>
            <Terminal size={18} /> 1. Acceptance of Terms
          </h2>
          <p>
            Tools CLI provides interactive command line simulators, guides, and
            tools. By utilizing any part of this platform, you acknowledge that
            you have read, understood, and agree to follow all guidelines and
            conditions specified in this document.
          </p>
        </section>

        <section className="legal-section">
          <h2>
            <Scale size={18} /> 2. Use License & Permissions
          </h2>
          <p>
            This website is open-source software released under the MIT License.
            You are free to:
          </p>
          <ul>
            <li>
              Use the tool generators for personal or commercial development.
            </li>
            <li>
              Fork and modify the codebase in accordance with our repository
              licenses.
            </li>
            <li>Use local simulation commands for educational purposes.</li>
          </ul>
          <p>
            However, you may not use the platform to perform malicious actions,
            run automation spiders that degrade the host web performance, or
            misrepresent the simulator output as a secure remote environment
            executor.
          </p>
        </section>

        <section className="legal-section">
          <h2>
            <Shield size={18} /> 3. Simulated Execution Disclaimer
          </h2>
          <p>
            All terminal execution outputs displayed on this site are{" "}
            <strong>simulated locally</strong>
            inside your browser console sandbox. No actual commands are executed
            on your local machine or our servers.
          </p>
          <p>
            We are not responsible for any issues, data loss, or
            misconfigurations that arise from manually copy-pasting generated
            commands into your physical terminal environments. Always review
            generated scripts carefully before execution in production.
          </p>
        </section>

        <section className="legal-section">
          <h2>
            <HelpCircle size={18} /> 4. Disclaimer of Warranties
          </h2>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Changes to Terms</h2>
          <p>
            We reserve the right to revise or update these terms at any time.
            The date at the top will show the latest modifications. Your
            continued use of the platform after any changes implies acceptance
            of those updates.
          </p>
        </section>
      </div>
    </div>
  );
}
