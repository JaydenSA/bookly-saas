import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      content: 'Found the perfect landscaper through this platform. Professional, reliable, and the results exceeded my expectations!',
      avatar: 'S',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Business Owner',
      content: 'As a service provider, this platform has connected me with amazing clients. The booking system is seamless and user-friendly.',
      avatar: 'M',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      role: 'Property Manager',
      content: 'I use this platform regularly for maintenance services. Every expert I&apos;ve hired has been top-notch and reliable.',
      avatar: 'L',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D4D] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from real customers who have found success with our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white border-gray-200 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#2ECC71]/10 rounded-full flex items-center justify-center text-[#2ECC71] font-semibold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-[#1A4D4D]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
