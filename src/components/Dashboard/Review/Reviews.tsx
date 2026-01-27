"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Trash2,
  MoreVertical,
  Star,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  useAllReviews,
  useUpdateReviewStatus,
} from "@/lib/hooks/useReview";
import { Review, ReviewAnalytics } from "@/lib/types/review";
import ReviewsModal from "./ReviewModal";

export default function Reviews() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const { mutate: updateStatus } = useUpdateReviewStatus();
  const limit = 10;

  const { data, isLoading, isError } = useAllReviews({
    page: currentPage,
    limit: limit,
  });

  const SupplierManagementData: ReviewAnalytics | undefined = data?.analytics;
  const reviewsData = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const approveReview = (id: string) => {
    if (window.confirm("Are you sure you want to approve this review?")) {
      updateStatus({ id, status: "approved" });
    }
  };

  const rejectReview = (id: string) => {
    if (window.confirm("Are you sure you want to reject this review?")) {
      updateStatus({ id, status: "rejected" });
    }
  };

  const viewReview = (review: Review) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading reviews. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Header */}
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Review Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor customer reviews
          </p>
        </div> */}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ... (keep stat cards as they are, using SupplierManagementData) */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {SupplierManagementData?.totalReview || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-teal-600">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-teal-600">
                {SupplierManagementData?.totalPendingReview || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-600">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                {SupplierManagementData?.averageRating || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {SupplierManagementData?.thisMonthReviewCount || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Reviews
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 border cursor-pointer"
            >
              Sort by <ChevronDown />
            </Button>
          </div>

          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <Table>
              <TableBody>
                {reviewsData.map((review: Review) => (
                  <TableRow
                    key={review._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition block my-4"
                  >
                    <TableCell className="block p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Product ID: {review.productId}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>
                              {review.userId ? `${review.userId.firstName} ${review.userId.lastName}` : "Anonymous"}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>

                            <Badge
                              className={`ml-2 capitalize ${
                                review.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : review.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {review.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-gray-700 text-sm mt-4">
                        {review.comment}
                      </p>

                      {/* Divider */}
                      <div className="border-t my-4" />

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== "approved" && (
                          <div className=" space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 outline-none border-none"
                              onClick={() => approveReview(review._id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>

                            {review.status !== "rejected" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectReview(review._id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            )}
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewReview(review)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900 bg-transparent"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ←
              </Button>
              {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={
                      currentPage === page
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "text-gray-600 bg-transparent"
                    }
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900 bg-transparent"
                onClick={() =>
                  handlePageChange(Math.min(meta.totalPage, currentPage + 1))
                }
                disabled={currentPage === meta.totalPage}
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>
      <ReviewsModal
        modalOpen={modalOpen}
        onModalChange={setModalOpen}
        data={selectedReview}
      />
    </main>
  );
}
