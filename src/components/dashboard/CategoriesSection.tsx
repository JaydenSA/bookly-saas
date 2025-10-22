'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Category, CategoryFormData, CategoriesSectionProps } from '@/types';

export default function CategoriesSection({ businessId }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3B82F6',
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/categories?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        showError('Failed to load categories', {
          description: 'Please try refreshing the page',
        });
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      showError('Failed to load categories', {
        description: 'Check your internet connection and try again',
      });
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, showError]);

  useEffect(() => {
    if (businessId) {
      fetchCategories();
    }
  }, [businessId, fetchCategories]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
    });
    setEditingCategory(null);
  };

  const handleCreateCategory = async () => {
    const loadingToast = showLoading('Creating category...', {
      description: 'Please wait while we add your category',
    });

    try {
      setIsCreating(true);
      const categoryData = {
        ...formData,
        businessId,
      };

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      const data = await response.json();
      setCategories(prev => [data, ...prev]);
      setIsDialogOpen(false);
      resetForm();

      dismiss(loadingToast);
      showSuccess('Category created successfully!', {
        description: `${formData.name} has been added to your categories`,
      });
    } catch (err) {
      console.error('Error creating category:', err);
      dismiss(loadingToast);
      showError('Failed to create category', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    const loadingToast = showLoading('Updating category...', {
      description: 'Saving your changes',
    });

    try {
      setIsUpdating(categoryId);
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      const data = await response.json();
      setCategories(prev => prev.map(category => 
        category._id === categoryId ? data : category
      ));
      setIsDialogOpen(false);
      resetForm();

      dismiss(loadingToast);
      showSuccess('Category updated successfully!', {
        description: 'Your changes have been saved',
      });
    } catch (err) {
      console.error('Error updating category:', err);
      dismiss(loadingToast);
      showError('Failed to update category', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const loadingToast = showLoading('Deleting category...', {
      description: 'Please wait while we remove this category',
    });

    try {
      setIsDeleting(categoryId);
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      setCategories(prev => prev.filter(category => category._id !== categoryId));

      dismiss(loadingToast);
      showSuccess('Category deleted successfully!', {
        description: 'The category has been removed from your business',
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      dismiss(loadingToast);
      showError('Failed to delete category', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Service Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Service Categories
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory 
                    ? 'Update your category details below.' 
                    : 'Add a new category to organize your services.'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Hair Services, Massage, Consultation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what services belong in this category..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => editingCategory ? handleUpdateCategory(editingCategory._id) : handleCreateCategory()}
                    disabled={isCreating || (isUpdating !== null)}
                  >
                    {isCreating || (isUpdating !== null) ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-4">
              Add categories to organize your services
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center gap-4 justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                    disabled={isUpdating === category._id}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteCategory(category._id)}
                    disabled={isDeleting === category._id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
