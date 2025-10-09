import { Calendar, BarChart3, Users, Shield, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent calendar management with automated conflict detection and optimal time slot suggestions.',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your business performance with real-time metrics and reporting.',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Complete customer profiles with booking history, preferences, and communication tools.',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'PCI-compliant payment processing with support for multiple payment methods and currencies.',
      iconBg: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Zap,
      title: 'Automation',
      description: 'Automated reminders, follow-ups, and notifications to reduce no-shows and improve customer experience.',
      iconBg: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      icon: Globe,
      title: 'Multi-Platform',
      description: 'Access your booking system from anywhere with our web, mobile, and API integrations.',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <section id="features" className="landing-features-section">
      <div className="general-container-wide">
        <div className="landing-features-header">
          <h2 className="landing-features-title">
            Everything you need to succeed
          </h2>
          <p className="landing-features-subtitle">
            Powerful features designed to streamline your booking process and grow your business
          </p>
        </div>
        <div className="landing-features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="landing-feature-card">
                <CardHeader className="landing-feature-card-header">
                  <div className={`landing-feature-icon-container ${feature.iconBg}`}>
                    <IconComponent className={`landing-feature-icon ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="landing-feature-card-title">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="landing-feature-description">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
