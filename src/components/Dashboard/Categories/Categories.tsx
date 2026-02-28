"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAllCategories } from "@/lib/hooks/useCategory";
import { Category } from "@/lib/types/category";
import { FolderTree, Package, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import CategoryModal from "./AddCategoryModal";
import CategoryCard from "./CategoryCard";
import CategorySkeleton from "./CategorySkeleton";

export default function Categories() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data, isLoading, error } = useAllCategories(params);

  const categories = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  // Calculate stats
  const totalCategories = meta.total || categories.length;
  const activeCategories = categories.length;
  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.productName?.length || 0),
    0,
  );
  const topCategory = categories.reduce(
    (top, cat) =>
      (cat.productName?.length || 0) > (top?.productName?.length || 0)
        ? cat
        : top,
    categories[0],
  );

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = (category: Category) => {
    // TODO: Implement delete functionality
    console.log("Delete category:", category);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500 text-center py-10">
          Error loading categories. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* <div>
          <h1 className="text-2xl font-bold text-[#101828]">
            Category Management
          </h1>
          <p className="text-[#4A5565]">Organize and manage product categories</p>
        </div> */}
        <Button
          onClick={handleAddNew}
          className="bg-[#086646] hover:bg-[#065535] text-white gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Category Modal (Create/Edit) */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#086646]/10 rounded-lg">
                <FolderTree className="h-5 w-5 text-[#086646]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "-" : totalCategories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Categories</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {isLoading ? "-" : activeCategories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "-" : totalProducts.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FolderTree className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Category</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {isLoading
                    ? "-"
                    : topCategory
                      ? `${topCategory.region} (${topCategory.productName?.length || 0})`
                      : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <CategorySkeleton />
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FolderTree className="h-12 w-12 mb-4" />
          <p className="text-lg">No categories found</p>
          <p className="text-sm">Create your first category to get started</p>
        </div>
      ) : (
        <>
          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category: Category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPage > 1 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Page {meta.page} of {meta.totalPage}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(params.page - 1)}
                  disabled={params.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(params.page + 1)}
                  disabled={params.page >= meta.totalPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
