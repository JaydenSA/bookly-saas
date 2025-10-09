import { Calendar } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="landing-footer-section">
      <div className="general-container-wide">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">
              <div className="landing-footer-logo-icon">
                <Calendar className="landing-footer-logo-svg" />
              </div>
              <span className="landing-footer-logo-text">BookFlow</span>
            </div>
            <p className="landing-footer-description">
              The complete booking management solution for modern businesses. 
              Streamline operations, delight customers, and grow your business.
            </p>
            <div className="landing-footer-social">
              <div className="landing-footer-social-item">
                <span className="landing-footer-social-text">f</span>
              </div>
              <div className="landing-footer-social-item">
                <span className="landing-footer-social-text">t</span>
              </div>
              <div className="landing-footer-social-item">
                <span className="landing-footer-social-text">in</span>
              </div>
              <div className="landing-footer-social-item">
                <span className="landing-footer-social-text">ig</span>
              </div>
            </div>
          </div>
          
          <div className="landing-footer-links">
            <h3 className="landing-footer-links-title">Product</h3>
            <ul className="landing-footer-links-list">
              <li><a href="#" className="landing-footer-link">Features</a></li>
              <li><a href="#" className="landing-footer-link">Pricing</a></li>
              <li><a href="#" className="landing-footer-link">Integrations</a></li>
              <li><a href="#" className="landing-footer-link">API</a></li>
              <li><a href="#" className="landing-footer-link">Changelog</a></li>
            </ul>
          </div>
          
          <div className="landing-footer-links">
            <h3 className="landing-footer-links-title">Company</h3>
            <ul className="landing-footer-links-list">
              <li><a href="#" className="landing-footer-link">About</a></li>
              <li><a href="#" className="landing-footer-link">Blog</a></li>
              <li><a href="#" className="landing-footer-link">Careers</a></li>
              <li><a href="#" className="landing-footer-link">Contact</a></li>
              <li><a href="#" className="landing-footer-link">Press</a></li>
            </ul>
          </div>
        </div>
        
        <div className="landing-footer-bottom">
          <p className="landing-footer-copyright">
            © 2024 BookFlow. All rights reserved.
          </p>
          <div className="landing-footer-legal">
            <a href="#" className="landing-footer-legal-link">Privacy Policy</a>
            <a href="#" className="landing-footer-legal-link">Terms of Service</a>
            <a href="#" className="landing-footer-legal-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
