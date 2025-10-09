'use client';

import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  return (
    <section className="landing-hero-section py-32">
      <div className="landing-hero-background"></div>
      <div className="general-container-wide">
        <div className="landing-hero-content">
          <Badge variant="secondary" className="landing-hero-badge">
            🚀 Now Available - Book smarter, not harder
          </Badge>
          <h1 className="landing-hero-title">
            The Future of
            <span className="landing-hero-title-gradient"> Booking</span>
            <br />
            Management
          </h1>
          <p className="landing-hero-description">
            Streamline your business operations with our all-in-one booking platform. 
            Manage appointments, payments, and customer relationships effortlessly.
          </p>
          <div className="landing-hero-actions">
            <Button size="lg" className="landing-hero-primary-button">
              Start Free Trial
              <ArrowRight className="landing-hero-button-icon" />
            </Button>
            <Button variant="outline" size="lg" className="landing-hero-secondary-button">
              Watch Demo
            </Button>
          </div>
          <div className="landing-hero-trust-indicators">
            <div className="landing-hero-trust-item">
              <Check className="landing-hero-check-icon" />
              No credit card required
            </div>
            <div className="landing-hero-trust-item">
              <Check className="landing-hero-check-icon" />
              14-day free trial
            </div>
            <div className="landing-hero-trust-item">
              <Check className="landing-hero-check-icon" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
