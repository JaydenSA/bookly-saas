'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, Clock, Percent, Building, ArrowLeft, Scissors, Search, Star, Package, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSnackbar } from '@/hooks/useSnackbar';
import Link from 'next/link';
import { Business, Service, Category } from '@/types';

export default function BusinessPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const { showError } = useSnackbar();

  useEffect(() => {
    const fetchBusinessAndServices = async () => {
      try {
        setIsLoading(true);
        
        // Fetch business
        const businessResponse = await fetch(`/api/businesses?slug=${slug}`);
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          if (businessData.businesses && businessData.businesses.length > 0) {
            const business = businessData.businesses[0];
            setBusiness(business);
            
            // Fetch services for this business
            const servicesResponse = await fetch(`/api/services?businessId=${business._id}`);
            if (servicesResponse.ok) {
              const servicesData = await servicesResponse.json();
              setServices(servicesData.services || []);
            }

            // Fetch categories for this business
            const categoriesResponse = await fetch(`/api/categories?businessId=${business._id}`);
            if (categoriesResponse.ok) {
              const categoriesData = await categoriesResponse.json();
              setCategories(categoriesData.categories || []);
            }
          } else {
            showError('Business not found', {
              description: 'The business you are looking for does not exist.',
            });
          }
        } else {
          throw new Error('Failed to fetch business');
        }
      } catch (err) {
        console.error('Error fetching business and services:', err);
        showError('Failed to load business', {
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBusinessAndServices();
    }
  }, [slug, showError]);

  const nextImage = () => {
    if (business?.images && business.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % business.images!.length);
    }
  };

  const prevImage = () => {
    if (business?.images && business.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + business.images!.length) % business.images!.length);
    }
  };

  // Filter services based on search query and category
  const filteredServices = services.filter(service => {
    // Search filter
    if (serviceSearchQuery.trim()) {
      const query = serviceSearchQuery.toLowerCase();
      const matchesSearch = (
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategoryId) {
      const serviceCategoryId = typeof service.categoryId === 'object' ? service.categoryId._id : service.categoryId;
      return serviceCategoryId === selectedCategoryId;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Not Found</h3>
            <p className="text-gray-600 mb-4">
              The business you are looking for does not exist or has been removed.
            </p>
            <Link href="/discover">
              <Button>Back to Discover</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gallery Background */}
      <div className="relative h-96 overflow-hidden">
        {business.images && business.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={business.images[currentImageIndex]}
              alt={`${business.name} gallery image ${currentImageIndex + 1}`}
              // fill
              className="object-cover w-full h-full"
              priority
              width={1920}
              height={1080}
            />
            {/* Image Navigation */}
            {business.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  →
                </Button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {business.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Building className="h-24 w-24 text-white/50" />
          </div>
        )}
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link href="/discover">
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discover
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="general-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 py-8">
          <div>
            {/* Business Info Overlay */}
            <div className="form-container">
              {/* Business Logo */}
              {business.logoUrl && (
                <div className="form-field">
                  <div className="flex items-center justify-center mb-8 w-full">
                    <Image
                      src={business.logoUrl}
                      alt={`${business.name} logo`}
                      width={150}
                      height={150}
                      className="object-contain w-full h-[150px]"
                    />
                  </div>
                </div>
              )}

              {/* Business Name */}
              <h3 className="form-title">
                <Building className="form-title-icon" />
                {business.name}
              </h3>
              
              <div className="general-space-form">
                {/* Business Category */}
                <div className="form-field">
                  <div className="flex items-start">
                    <Building className="general-icon-primary general-icon-md mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="form-label">Category</p>
                      <p className="general-text-secondary text-sm">{business.category}</p>
                    </div>
                  </div>
                </div>

                {/* Deposit Percentage */}
                {business.depositPercentage > 0 && (
                  <div className="form-field">
                    <div className="flex items-start">
                      <Percent className="general-icon-primary general-icon-md mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="form-label">Deposit Required</p>
                        <p className="general-text-secondary text-sm">{business.depositPercentage}% deposit required</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                {business.address && (
                  <div className="form-field">
                    <div className="flex items-start">
                      <MapPin className="general-icon-primary general-icon-md mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="form-label">Address</p>
                        <p className="general-text-secondary text-sm">{business.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timezone */}
                {business.timezone && (
                  <div className="form-field">
                    <div className="flex items-start">
                      <Globe className="general-icon-primary general-icon-md mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="form-label">Timezone</p>
                        <p className="general-text-secondary text-sm">{business.timezone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Since */}
                <div className="form-field">
                  <div className="flex items-start">
                    <Clock className="general-icon-primary general-icon-md mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="form-label">Member Since</p>
                      <p className="general-text-secondary text-sm">
                        {new Date(business.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Description Section */}
            {business.description && (
              <div className="form-container">
                <h3 className="form-title">About {business.name}</h3>
                <p className="general-text-secondary leading-relaxed">{business.description}</p>
              </div>
            )}
            
          </div>

          {/* Services Section */}
          <div className="form-container">
            <h3 className="form-title">
              <Scissors className="form-title-icon" />
              Services
            </h3>
            <p className="general-text-secondary mb-6">Choose from our range of professional services</p>
            
            {/* Service Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 general-icon-primary general-icon-md" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategoryId === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategoryId('')}
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    All Services
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category._id}
                      variant={selectedCategoryId === category._id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategoryId(category._id)}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <Tag className="h-4 w-4" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Services List Grouped by Category */}
            {filteredServices.filter(service => service.isActive).length > 0 ? (
              <div className="space-y-8">
                {(() => {
                  // Group services by category
                  const groupedServices = filteredServices
                    .filter(service => service.isActive)
                    .reduce((groups, service) => {
                      const categoryId = typeof service.categoryId === 'object' ? service.categoryId._id : service.categoryId;
                      const categoryName = typeof service.categoryId === 'object' 
                        ? service.categoryId.name 
                        : categories.find(cat => cat._id === service.categoryId)?.name || 'Uncategorized';
                      const categoryColor = typeof service.categoryId === 'object' 
                        ? service.categoryId.color 
                        : categories.find(cat => cat._id === service.categoryId)?.color || '#6B7280';
                      
                      if (!groups[categoryName]) {
                        groups[categoryName] = {
                          categoryId,
                          categoryName,
                          categoryColor,
                          services: []
                        };
                      }
                      groups[categoryName].services.push(service);
                      return groups;
                    }, {} as Record<string, { categoryId: string | undefined; categoryName: string; categoryColor: string; services: Service[] }>);

                  // Sort categories by name
                  const sortedCategories = Object.values(groupedServices).sort((a, b) => a.categoryName.localeCompare(b.categoryName));

                  return sortedCategories.map((categoryGroup) => (
                    <div key={categoryGroup.categoryName} className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoryGroup.categoryColor }}
                        />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {categoryGroup.categoryName}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {categoryGroup.services.length} service{categoryGroup.services.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>

                      {/* Services in this category */}
                      <div className="space-y-3">
                        {categoryGroup.services.map((service) => (
                          <div key={service._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">{service.name}</h5>
                              {service.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                              )}
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">{service.duration} min</span>
                                {service.depositRequired && (
                                  <>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                                    <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Deposit required</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                R{service.price.toFixed(2)}
                              </span>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scissors className="general-icon-primary general-icon-md mx-auto mb-4 opacity-50" />
                {serviceSearchQuery.trim() ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">No services found matching "{serviceSearchQuery}".</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Try adjusting your search terms.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">No services available at the moment.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Please check back later or contact the business directly.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}
