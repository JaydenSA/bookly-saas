export default function StatsSection() {
  return (
    <section className="py-20 bg-[#1A4D4D] relative overflow-hidden" id="stats">
      {/* Abstract shapes background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2ECC71] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2ECC71] rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-3 h-3 bg-[#2ECC71] rounded-full mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Top Rated Certified Experts in Your Area
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Connect with verified professionals who deliver exceptional service in your community.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              500+
            </div>
            <div className="text-gray-200 font-medium">
              Local Experts
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              15K+
            </div>
            <div className="text-gray-200 font-medium">
              Happy Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              25K+
            </div>
            <div className="text-gray-200 font-medium">
              Projects Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              4.8★
            </div>
            <div className="text-gray-200 font-medium">
              Average Rating
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button className="bg-[#2ECC71] hover:bg-[#27AE60] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Find Experts
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1A4D4D] px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200">
            Browse Now
          </button>
        </div>
      </div>
    </section>
  );
}
