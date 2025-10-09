import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 100 bookings/month',
        'Basic calendar management',
        'Email notifications',
        'Customer database',
        'Basic reporting'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        'Up to 500 bookings/month',
        'Advanced scheduling',
        'SMS & Email notifications',
        'Payment processing',
        'Advanced analytics',
        'API access'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Unlimited bookings',
        'Multi-location support',
        'Custom integrations',
        'Priority support',
        'White-label options',
        'Dedicated account manager'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="landing-pricing-section">
      <div className="general-container-wide">
        <div className="landing-pricing-header">
          <h2 className="landing-pricing-title">
            Simple, transparent pricing
          </h2>
          <p className="landing-pricing-subtitle">
            Choose the plan that's right for your business
          </p>
        </div>
        <div className="landing-pricing-grid">
          {plans.map((plan, index) => (
            <Card key={index} className={`landing-pricing-card ${plan.popular ? 'landing-pricing-card-popular' : ''}`}>
              {plan.popular && (
                <div className="landing-pricing-badge">
                  <Badge className="landing-pricing-badge-content">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="landing-pricing-card-header">
                <CardTitle className="landing-pricing-card-title">{plan.name}</CardTitle>
                <div className="landing-pricing-price-container">
                  <span className="landing-pricing-price">{plan.price}</span>
                  <span className="landing-pricing-period">{plan.period}</span>
                </div>
                <p className="landing-pricing-card-description">{plan.description}</p>
              </CardHeader>
              <CardContent className="landing-pricing-card-content">
                <div className="landing-pricing-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="landing-pricing-feature-item">
                      <Check className="landing-pricing-check-icon" />
                      <span className="landing-pricing-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className={`landing-pricing-button landing-pricing-button-${plan.buttonVariant}`} variant={plan.buttonVariant}>
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
