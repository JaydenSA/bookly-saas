'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Clock, X, Image as ImageIcon, Building, Globe, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Business } from '@/types';

const CATEGORIES = [
  'Beauty & Wellness',
  'Health & Medical',
  'Fitness & Sports',
  'Education & Training',
  'Professional Services',
  'Food & Beverage',
  'Automotive',
  'Home & Garden',
  'Technology',
  'Entertainment',
  'Other'
];

export default function DiscoverPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const { showError } = useSnackbar();

  const fetchBusinesses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/businesses');
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
        setFilteredBusinesses(data.businesses || []);
      } else {
        showError('Failed to load businesses', {
          description: 'Please try refreshing the page',
        });
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
      showError('Failed to load businesses', {
        description: 'Check your internet connection and try again',
      });
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Filter and sort businesses
  useEffect(() => {
    let filtered = businesses;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.address?.toLowerCase().includes(query) ||
        business.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    // Sort businesses
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
  }, [businesses, searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== 'all' || sortBy !== 'newest';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="general-container py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Businesses</h1>
            <p className="text-lg text-gray-600">Find the perfect service for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-layout">
      <div className="general-container py-8">
        {/* Header */}
        <div className="discover-header">
          <h1 className="discover-title">Discover Businesses</h1>
          <p className="discover-subtitle">Find the perfect service for your needs</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search businesses, services, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
                {hasActiveFilters && ' (filtered)'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Grid */}
        {filteredBusinesses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {businesses.length === 0 ? 'No businesses found' : 'No matching businesses'}
              </h3>
              <p className="text-gray-600 mb-4">
                {businesses.length === 0 
                  ? 'Be the first to add your business to our platform!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="discover-grid">
            {filteredBusinesses.map((business) => (
              <Card key={business._id} className="discover-card cursor-pointer overflow-hidden">
                {/* Business Header with Logo */}
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    {business.logoUrl ? (
                      <div className="flex-shrink-0">
                        <Image
                          src={business.logoUrl}
                          alt={`${business.name} logo`}
                          width={60}
                          height={60}
                          className="h-16 w-16 rounded-xl object-contain shadow-md border-2 border-white dark:border-gray-800"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800">
                          <Building className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {business.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {business.category || 'Uncategorized'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Business Images Gallery */}
                {business.images && business.images.length > 0 && (
                  <div className="aspect-video relative">
                    <Image
                      src={business.images[0]}
                      alt={`${business.name} image`}
                      fill
                      className="object-cover"
                    />
                    {business.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        +{business.images.length - 1} more
                      </div>
                    )}
                  </div>
                )}

                <CardContent className="p-4">
                  {business.description && (
                    <CardDescription className="mb-3 line-clamp-2 text-sm">
                      {business.description}
                    </CardDescription>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {business.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                    )}

                    {business.timezone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{business.timezone}</span>
                      </div>
                    )}

                    {business.depositPercentage > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Percent className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{business.depositPercentage}% deposit required</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Recently added</span>
                    </div>
                    <Link href={`/business/${business.slug}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}