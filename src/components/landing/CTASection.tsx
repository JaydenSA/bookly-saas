import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-20 bg-[#1A4D4D] relative overflow-hidden" id="cta">
      {/* Abstract shapes background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2ECC71] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2ECC71] rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#2ECC71] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-3 h-3 bg-[#2ECC71] rounded-full mx-auto mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Find Top Rated Certified Experts in Your Area
        </h2>
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with verified professionals who deliver exceptional service in your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-[#2ECC71] hover:bg-[#27AE60] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Find Experts
            <Plus className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#1A4D4D] px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200">
            Browse Now
          </Button>
        </div>
      </div>
    </section>
  );
}
