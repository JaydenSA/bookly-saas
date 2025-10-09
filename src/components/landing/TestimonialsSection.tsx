import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Salon Owner',
      content: 'This platform has revolutionized how we manage our appointments. The automation features have reduced no-shows by 40%.',
      avatar: 'S',
      avatarColor: 'bg-blue-500'
    },
    {
      name: 'Mike Chen',
      role: 'Fitness Studio',
      content: 'The analytics dashboard gives us incredible insights into our business performance. Highly recommended!',
      avatar: 'M',
      avatarColor: 'bg-green-500'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Medical Practice',
      content: 'Customer support is outstanding. They helped us migrate from our old system seamlessly.',
      avatar: 'A',
      avatarColor: 'bg-purple-500'
    }
  ];

  return (
    <section id="testimonials" className="landing-testimonials-section">
      <div className="general-container">
        <div className="landing-testimonials-header">
          <h2 className="landing-testimonials-title">
            What our customers say
          </h2>
          <p className="landing-testimonials-subtitle">
            Don't just take our word for it
          </p>
        </div>
        <div className="landing-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="landing-testimonial-card">
              <CardContent className="landing-testimonial-content">
                <div className="landing-testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="landing-testimonial-star" />
                  ))}
                </div>
                <p className="landing-testimonial-text">
                  "{testimonial.content}"
                </p>
                <div className="landing-testimonial-author">
                  <div className={`landing-testimonial-avatar ${testimonial.avatarColor}`}>
                    {testimonial.avatar}
                  </div>
                  <div className="landing-testimonial-author-info">
                    <div className="landing-testimonial-author-name">{testimonial.name}</div>
                    <div className="landing-testimonial-author-role">{testimonial.role}</div>
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
