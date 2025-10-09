import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="landing-cta-section">
      <div className="general-container-wide">
        <h2 className="landing-cta-title">
          Ready to transform your business?
        </h2>
        <p className="landing-cta-description">
          Join thousands of businesses already using our platform to streamline their operations.
        </p>
        <div className="landing-cta-actions">
          <Button size="lg" variant="secondary" className="landing-cta-primary-button">
            Start Free Trial
            <ArrowRight className="landing-cta-button-icon" />
          </Button>
          <Button size="lg" variant="outline" className="landing-cta-secondary-button">
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
