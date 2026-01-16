"use client";

import { useState } from "react";
import { useAllProducts, useFilterProducts } from "@/lib/hooks/useProduct";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, X } from "lucide-react";

export default function Products() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    categoryRegion: "",
    originCountry: "",
    supplierBrand: "",
    sort: "az",
  });

  const { data, isLoading, error } = useAllProducts(params);
  const { data: filterData } = useFilterProducts();

  const products = data?.data || [];
  const meta = data?.meta || {}; // Assuming API returns meta for pagination

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  // };

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setParams({
      page: 1,
      limit: 10,
      search: "",
      categoryRegion: "",
      originCountry: "",
      supplierBrand: "",
      sort: "az",
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#101828]">Product Inventory</h1>
        <p className="text-[#4A5565]">Manage your products and update prices</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        {/* <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={params.search}
            onChange={handleSearchChange}
          />
        </div> */}

        <div className="flex gap-2 flex-wrap items-center w-full md:w-auto">
          {/* Brand Filter */}
          <FilterDropdown
            label="Brand"
            value={params.supplierBrand}
            options={filterData?.data?.allBrands || []}
            onChange={(val) => handleFilterChange("supplierBrand", val)}
          />

          {/* Region Filter */}
          <FilterDropdown
            label="Region"
            value={params.categoryRegion}
            options={filterData?.data?.allRegion || []}
            onChange={(val) => handleFilterChange("categoryRegion", val)}
          />

          {/* Country Filter */}
          <FilterDropdown
            label="Country"
            value={params.originCountry}
            options={filterData?.data?.allOriginCountry || []}
            onChange={(val) => handleFilterChange("originCountry", val)}
          />

          {/* Sort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                Sort: {params.sort === "az" ? "A-Z" : "Z-A"}{" "}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "az")}
              >
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sort", "za")}
              >
                Name (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(params.supplierBrand ||
            params.categoryRegion ||
            params.originCountry ||
            params.search) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title="Clear Filters"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">
          Error loading products. Please try again.
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={products} />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-gray-500">
              Page {meta.page || params.page} of {meta.totalPage || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setParams((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={params.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setParams((prev) => ({ ...prev, page: prev.page + 1 }))
                } // Assuming API handles upper bound or we use meta.totalPage
                disabled={meta.page >= meta.totalPage}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-2 bg-white min-w-[100px] justify-between"
        >
          <span className="truncate max-w-[120px]">{value || label}</span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 max-h-60 overflow-y-auto">
        <DropdownMenuLabel>Select {label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onChange("")}>All</DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={value === option}
            onCheckedChange={() => onChange(option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
