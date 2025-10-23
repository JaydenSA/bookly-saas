import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingSection() {
  const plans = [
    {
      name: 'Featured for 2 weeks',
      price: '$199.00',
      period: '/month',
      description: 'Perfect for getting started with local visibility',
      features: [
        'Featured listing for 2 weeks',
        'Priority in search results',
        'Enhanced profile visibility',
        'Basic analytics',
        'Email support'
      ],
      buttonText: 'Purchase credit',
      buttonVariant: 'outline' as const,
      popular: false,
      available: true
    },
    {
      name: 'Featured for 3 weeks',
      price: '$299.00',
      period: '/month',
      description: 'Most popular choice for sustained visibility',
      features: [
        'Featured listing for 3 weeks',
        'Priority in search results',
        'Enhanced profile visibility',
        'Advanced analytics',
        'Phone & email support',
        'Social media promotion'
      ],
      buttonText: 'Purchase credit',
      buttonVariant: 'default' as const,
      popular: true,
      available: true
    },
    {
      name: 'Featured for 4 weeks',
      price: '$399.00',
      period: '/month',
      description: 'Maximum visibility for your business',
      features: [
        'Featured listing for 4 weeks',
        'Top priority in search results',
        'Maximum profile visibility',
        'Premium analytics',
        'Priority support',
        'Social media promotion',
        'Featured in newsletter'
      ],
      buttonText: 'Purchase credit',
      buttonVariant: 'outline' as const,
      popular: false,
      available: true
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D4D] mb-4">
            Pricing Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to boost your visibility and connect with more customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative p-6 bg-white border-gray-200 hover:shadow-lg transition-all duration-200 ${plan.popular ? 'border-[#2ECC71] ring-2 ring-[#2ECC71]/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#2ECC71] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-[#1A4D4D] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <CardTitle className="text-xl font-bold text-[#1A4D4D]">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#1A4D4D]">{plan.price}</span>
                  <span className="text-gray-500 text-lg">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-[#2ECC71] mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-[#2ECC71] hover:bg-[#27AE60] text-white' : 'border-[#1A4D4D] text-[#1A4D4D] hover:bg-[#1A4D4D] hover:text-white'}`}
                  variant={plan.buttonVariant}
                >
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
