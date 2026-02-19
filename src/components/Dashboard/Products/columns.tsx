"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, ImageIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export const getColumns = (
  onEdit: (product: Product) => void,
  onView: (product: Product) => void,
): ColumnDef<Product>[] => [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue<Product["images"]>("images");
      const firstImage = images && images.length > 0 ? images[0].url : null;
      const title = row.getValue<string>("title") || "Product Image";

      return (
        <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-900">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400 text-xs gap-1">
              <ImageIcon className="h-5 w-5 text-gray-400" />
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Product Name",
    cell: ({ row }) => {
      const title = row.getValue<string>("title");
      const shortDescription = row.original.shortDescription;

      return (
        <div className="flex flex-col gap-1 max-w-[250px]">
          <div className="font-medium text-gray-900 line-clamp-1" title={title}>
            {title}
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
    accessorKey: "productType",
    header: "Category",
    cell: ({ row }) => {
      return <div className="text-gray-700">{row.getValue("productType")}</div>;
    },
  },
  {
    accessorKey: "Region",
    header: "Region",
    cell: ({ row }) => {
      return (
        <div className="text-gray-700">{row.original?.category?.region}</div>
      );
    },
  },
  {
    accessorKey: "priceFrom",
    header: "Price From",
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
            variant="outline"
            className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4 text-gray-500" />
            View
          </Button>
        </div>
      );
    },
  },

  // {
  //   id: "actions",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
  //           onClick={() => onEdit(row.original)}
  //         >
  //           <Pencil className="h-4 w-4" />
  //         </Button>
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
  //         >
  //           <Trash2 className="h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
