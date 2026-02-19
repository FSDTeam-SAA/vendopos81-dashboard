// import React from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Button } from "@/components/ui/button";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-center space-x-2 mt-6">
//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="h-8 w-8"
//       >
//         <span className="sr-only">Previous</span>
//         <ChevronLeft className="h-4 w-4" />
//       </Button>

//       <div className="flex items-center space-x-1">
//         {[...Array(totalPages)].map((_, i) => (
//           <Button
//             key={i + 1}
//             variant={currentPage === i + 1 ? "default" : "outline"}
//             size="sm"
//             onClick={() => onPageChange(i + 1)}
//             className={`h-8 w-8 p-0 ${currentPage === i + 1 ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''}`}
//           >
//             {i + 1}
//           </Button>
//         ))}
//       </div>

//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="h-8 w-8"
//       >
//         <span className="sr-only">Next</span>
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// };

// export default Pagination;

// components/Pagination.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import React from "react";

interface PaginationProps {
  currentPage?: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 12,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i, index) => {
      const previous = range[index - 1];
      if (previous) {
        if (i - previous === 2) {
          rangeWithDots.push(previous + 1);
        } else if (i - previous > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
    });

    return rangeWithDots;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate showing range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems || totalPages * itemsPerPage,
  );

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Showing items info */}
          {totalItems && (
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startItem}</span> to{" "}
              <span className="font-semibold">{endItem}</span> of{" "}
              <span className="font-semibold">{totalItems}</span> results
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`flex items-center justify-center h-9 w-9 rounded-full border ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              } transition-colors`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="flex items-center justify-center h-9 w-9 text-gray-500">
                    <MoreHorizontal size={16} />
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageClick(page)}
                    className={`flex items-center justify-center h-9 w-9 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                      currentPage === page
                        ? " bg-[#09714e] hover:bg-green-90 hover:border-green-900 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center h-9 w-9 rounded-full border cursor-pointer ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              } transition-colors`}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Page info */}
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pagination;
