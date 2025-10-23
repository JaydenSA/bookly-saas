import { CheckCircle, Star, Shield, Users, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function FeaturesSection() {
  const features = [
    {
      icon: CheckCircle,
      title: 'Verified Professionals',
      description: 'All experts are background checked and verified to ensure quality and reliability.',
      color: 'text-[#2ECC71]'
    },
    {
      icon: Star,
      title: 'Top Rated Experts',
      description: 'Connect with the highest-rated professionals in your area based on customer reviews.',
      color: 'text-[#2ECC71]'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your safety is our priority with secure payments and verified service providers.',
      color: 'text-[#2ECC71]'
    },
    {
      icon: Users,
      title: 'Local Community',
      description: 'Support your local economy by connecting with professionals in your area.',
      color: 'text-[#2ECC71]'
    },
    {
      icon: MapPin,
      title: 'Location Based',
      description: 'Find experts near you with our advanced location-based search and matching.',
      color: 'text-[#2ECC71]'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock customer support team.',
      color: 'text-[#2ECC71]'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D4D] mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We connect you with the best local professionals through our trusted and verified platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-6 bg-white border-gray-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-[#2ECC71]/10">
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1A4D4D] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
