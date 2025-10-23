import { Search, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#2ECC71] rounded flex items-center justify-center mr-2">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-[#1A4D4D]">Local</span>
              <span className="text-xl font-bold text-[#2ECC71]">finder</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Connect with the best local professionals in your area. Find, book, and get the job done.
            </p>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search for..." 
                className="pl-10 border-gray-300 focus:border-[#2ECC71] focus:ring-[#2ECC71]"
              />
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-[#2ECC71] cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-[#2ECC71] cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-[#2ECC71] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Main Pages */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A4D4D] mb-4">Main pages</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Home V1</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Blog V2</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Start here</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Utility Pages */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A4D4D] mb-4">Utility pages</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Style guide</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Instructions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Licenses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Changelog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">404</a></li>
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A4D4D] mb-4">More</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2ECC71] transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 Localfinder. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Designed by</span>
              <a href="#" className="text-[#2ECC71] hover:text-[#27AE60] text-sm font-medium transition-colors">
                BRIX Templates
              </a>
              <span className="text-gray-500 text-sm">Powered by</span>
              <a href="#" className="text-[#2ECC71] hover:text-[#27AE60] text-sm font-medium transition-colors">
                Webflow
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}