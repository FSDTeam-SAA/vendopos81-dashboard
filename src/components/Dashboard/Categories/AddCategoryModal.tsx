/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateCategory, useUpdateCategory } from '@/lib/hooks/useCategory';
import { ImageIcon, Loader2, Plus, Trash2, X } from 'lucide-react';

interface CategoryItem {
  productType: string;
  productName: string[];
  productImage: File | null;
  preview: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
}

export default function CategoryModal({ isOpen, onClose, category: categoryData }: Props) {
  const [region, setRegion] = useState('');
  const [regionImage, setRegionImage] = useState<File | null>(null);
  const [regionPreview, setRegionPreview] = useState<string | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([
    { productType: '', productName: [''], productImage: null, preview: null },
  ]);

  const regionInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createRegion, isPending: creating } = useCreateCategory();
  const { mutate: updateRegion, isPending: updating } = useUpdateCategory();

  const isEditMode = !!categoryData;
  const loading = creating || updating;

  /* =========================
     RESET WHEN OPEN
  ==========================*/
  useEffect(() => {
    if (!isOpen) return;

    if (!categoryData?._id) {
      setRegion('');
      setRegionImage(null);
      setRegionPreview(null);
      setCategories([{ productType: '', productName: [''], productImage: null, preview: null }]);
    }
  }, [isOpen, categoryData]);

  /* =========================
     PREFILL EDIT DATA
  ==========================*/
  useEffect(() => {
    if (!categoryData?._id) return;

    setRegion(categoryData.region || '');
    setRegionPreview(categoryData.regionImage?.url || null);

    setCategories(
      (categoryData.categories || []).map((cat: any) => ({
        productType: cat.productType || '',
        productName: cat.productName || [''],
        productImage: null,
        preview: cat.productImage?.url || null,
      })),
    );
  }, [categoryData]);

  /* =========================
     IMAGE HANDLERS
  ==========================*/
  const handleRegionImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRegionImage(file);
      setRegionPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...categories];
      updated[index].productImage = file;
      updated[index].preview = reader.result as string;
      setCategories(updated);
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     CATEGORY HANDLERS
  ==========================*/
  const addCategory = () =>
    setCategories((prev) => [
      ...prev,
      { productType: '', productName: [''], productImage: null, preview: null },
    ]);

  const removeCategory = (index: number) =>
    setCategories((prev) => prev.filter((_, i) => i !== index));

  const updateProductType = (index: number, value: string) => {
    const updated = [...categories];
    updated[index].productType = value;
    setCategories(updated);
  };

  const addProductName = (catIndex: number) => {
    const updated = [...categories];
    updated[catIndex].productName.push('');
    setCategories(updated);
  };

  const removeProductName = (catIndex: number, nameIndex: number) => {
    const updated = [...categories];
    if (updated[catIndex].productName.length === 1) return;
    updated[catIndex].productName.splice(nameIndex, 1);
    setCategories(updated);
  };

  const updateProductName = (catIndex: number, nameIndex: number, value: string) => {
    const updated = [...categories];
    updated[catIndex].productName[nameIndex] = value;
    setCategories(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Add region - CRITICAL: Ensure this is always added
      if (region && region.trim()) {
        formData.append('region', region.trim());
      } else {
        console.error('Region is required');
        return;
      }

      // Add region image if it's a new file
      if (regionImage instanceof File) {
        formData.append('regionImage', regionImage, regionImage.name);
      }

      // Add categories
      categories.forEach((cat, catIndex) => {
        // Add product type
        if (cat.productType && cat.productType.trim()) {
          formData.append(`categories[${catIndex}][productType]`, cat.productType.trim());
        }

        // Add product names - ensure they're filtered and not empty
        const validProductNames = cat.productName.filter((name) => name && name.trim());
        validProductNames.forEach((name, nameIndex) => {
          formData.append(`categories[${catIndex}][productName][${nameIndex}]`, name.trim());
        });

        // Add category image if it's a new file
        if (cat.productImage instanceof File) {
          formData.append(
            `categories[${catIndex}][productTypeImage]`,
            cat.productImage,
            cat.productImage.name,
          );
        }
      });

      // Log the form data for debugging
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (isEditMode && categoryData?._id) {
        // Pass all data to the update function
        // Ensure formData contains identifiers the API may expect
        if (formData instanceof FormData) {
          formData.append('_id', categoryData._id);
          if (categoryData.slug) formData.append('slug', categoryData.slug);
        }

        updateRegion(
          {
            _id: categoryData._id,
            region: region.trim(),
            categories: categories.map((cat) => ({
              productType: cat.productType,
              productName: cat.productName.filter((name) => name && name.trim()),
              productImage: cat.productImage instanceof File ? cat.productImage : cat.preview,
            })),
            regionImage: regionImage instanceof File ? regionImage : null,
            formData, // Include the formData for the API call
          },
          { onSuccess: onClose },
        );
      } else {
        // Build payload expected by createRegion hook
        createRegion(
          {
            region: region.trim(),
            regionImage: regionImage instanceof File ? regionImage : undefined,
            categories: categories.map((cat) => ({
              productType: cat.productType,
              productName: cat.productName.filter((name) => name && name.trim()),
              productImage: cat.productImage instanceof File ? cat.productImage : undefined,
            })),
          },
          { onSuccess: onClose },
        );
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* REGION */}
          <div className="border rounded-xl p-5 space-y-4 bg-muted/20">
            <h3 className="font-semibold text-sm text-muted-foreground">Region Information</h3>

            <div className="space-y-2">
              <Label>Region Name</Label>
              <Input
                placeholder="Caribbean Food"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Region Image</Label>
              <input
                ref={regionInputRef}
                type="file"
                className="hidden"
                onChange={handleRegionImage}
              />

              <div
                onClick={() => regionInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
              >
                {regionPreview ? (
                  <img
                    src={regionPreview}
                    alt="Region preview"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground gap-2">
                    <ImageIcon size={28} />
                    <span className="text-sm">Upload Region Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="space-y-5">
            {categories.map((cat, catIndex) => (
              <div key={catIndex} className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Category {catIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategory(catIndex)}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Input
                    placeholder="Cooking Oils"
                    value={cat.productType}
                    onChange={(e) => updateProductType(catIndex, e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category Image</Label>

                  <input
                    type="file"
                    className="hidden"
                    id={`cat-img-${catIndex}`}
                    onChange={(e) => handleCategoryImage(e, catIndex)}
                  />

                  <div
                    onClick={() => document.getElementById(`cat-img-${catIndex}`)?.click()}
                    className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer"
                  >
                    {cat.preview ? (
                      <img
                        src={cat.preview}
                        alt="Category preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground gap-2">
                        <ImageIcon size={26} />
                        Upload Category Image
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Product Names</Label>
                  <div className="space-y-2">
                    {cat.productName.map((name, nameIndex) => (
                      <div key={nameIndex} className="flex gap-2">
                        <Input
                          value={name}
                          placeholder="Product name"
                          onChange={(e) => updateProductName(catIndex, nameIndex, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProductName(catIndex, nameIndex)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addProductName(catIndex)}
                  >
                    <Plus size={16} className="mr-1" /> Add Product
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={addCategory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add Category
          </Button>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditMode ? (
                'Update Category'
              ) : (
                'Create Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
