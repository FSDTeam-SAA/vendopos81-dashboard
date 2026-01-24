"use client";

import { Category } from "@/lib/types/category";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const productCount = category.productName?.length || 0;

  // Get image URL from API response, fallback to placeholder
  const getImageUrl = () => {
    // Prefer regionImage, then productImage, then placeholder
    if (category.regionImage?.url) {
      return category.regionImage.url;
    }
    if (category.productImage?.url) {
      return category.productImage.url;
    }
    // Fallback placeholder
    const colors = ["f59e0b", "10b981", "3b82f6", "ef4444", "8b5cf6", "ec4899"];
    const colorIndex = category.region.charCodeAt(0) % colors.length;
    return `https://placehold.co/200x150/${colors[colorIndex]}/ffffff?text=${encodeURIComponent(category.region.slice(0, 2))}`;
  };

  const imageUrl = getImageUrl();
  const isExternalImage = imageUrl.includes("cloudinary") || imageUrl.includes("placehold.co");

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Category Image */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={imageUrl}
              alt={category.region}
              fill
              className="object-cover"
              unoptimized={isExternalImage}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-[#086646] hover:bg-gray-100"
              onClick={() => onEdit?.(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete?.(category)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Info */}
        <div className="mt-3">
          <h3 className="font-semibold text-gray-900 text-lg">
            {category.region}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{category.productType}</p>
          <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
            <Package className="h-4 w-4" />
            <span>{productCount} products</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
