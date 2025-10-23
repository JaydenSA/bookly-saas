'use client';

import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white" id="hero">
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-[#1A4D4D] mb-6">
              Find Top Rated
              <span className="block text-[#2ECC71]">
                Local Experts
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with the best local professionals in your area. From home services to business solutions, 
              find and book everything your community has to offer.
            </p>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="What service do you need?" 
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-[#2ECC71] focus:ring-[#2ECC71] rounded-xl"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#2ECC71] hover:bg-[#27AE60] text-white px-6 py-2 rounded-lg">
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="bg-[#2ECC71] hover:bg-[#27AE60] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Find Local Experts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-[#1A4D4D] text-[#1A4D4D] hover:bg-[#1A4D4D] hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200">
                Become an Expert
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                <span className="font-medium">500+ Local Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                <span className="font-medium">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                <span className="font-medium">4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
