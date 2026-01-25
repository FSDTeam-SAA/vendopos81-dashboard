"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types/product";

export const getColumns = (onEdit: (product: Product) => void): ColumnDef<Product>[] => [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue<Product["images"]>("images");
      const firstImage = images && images.length > 0 ? images[0].url : null;
      const productName =
        row.getValue<string>("productName") || "Product Image";

      return (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-200">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={productName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
              No Img
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => {
      const productName = row.getValue<string>("productName");
      const shortDescription = row.original.shortDescription;

      return (
        <div className="flex flex-col gap-1 max-w-[250px]">
          <div
            className="font-medium text-gray-900 line-clamp-1"
            title={productName}
          >
            {productName}
          </div>
          {shortDescription && (
            <div
              className="text-xs text-gray-500 line-clamp-2"
              title={shortDescription}
            >
              {shortDescription}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured", 
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.getValue<boolean>("isFeatured");
      return (
        <Badge
          variant={isFeatured ? "default" : "secondary"}
          className={
            isFeatured
              ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200 shadow-none"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200 shadow-none"
          }
        >
          {isFeatured ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "productType",
    header: "Category",
    cell: ({ row }) => {
      return <div className="text-gray-700">{row.getValue("productType")}</div>;
    },
  },
  {
    accessorKey: "priceFrom",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("priceFrom"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="font-medium text-gray-900">{formatted}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");

      let badgeStyle = "bg-gray-100 text-gray-600 border-gray-200";

      if (
        status?.toLowerCase() === "approved" ||
        status?.toLowerCase() === "active"
      ) {
        badgeStyle = "bg-green-100 text-green-700 border-green-200";
      } else if (status?.toLowerCase() === "pending") {
        badgeStyle = "bg-yellow-100 text-yellow-700 border-yellow-200";
      } else if (
        status?.toLowerCase() === "rejected" ||
        status?.toLowerCase() === "inactive"
      ) {
        badgeStyle = "bg-red-100 text-red-700 border-red-200";
      }

      return (
        <Badge
          variant="outline"
          className={`${badgeStyle} shadow-none capitalize hover:${badgeStyle.split(" ")[0]}`}
        >
          {status || "N/A"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
