import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Hash, DollarSign, Star, Box, MapPin, Calendar, Tag, Clock, ShoppingCart, Check, Award, Leaf, Snowflake } from "lucide-react";
import { useReportBestSellingProductSingle } from "@/lib/hooks/useReport";
import { BestsellingSingleProduct } from "@/lib/types/bestSellingSingleProduct";

interface ViewModalProps {
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  id: string;
}

const ViewModal = ({ viewModalOpen, setViewModalOpen, id }: ViewModalProps) => {
  const { data, isLoading } = useReportBestSellingProductSingle(id);
  const product: BestsellingSingleProduct | undefined = data?.data;

  if (!id) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-5 h-5 text-teal-600" />
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : product ? (
          <div className="space-y-6 py-4">
            {/* Header with Image & Title */}
            <div className="flex flex-col sm:flex-row items-start gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-xl bg-white shadow-md overflow-hidden border border-gray-200">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <Box className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-xl text-gray-900">{product.title}</h3>
                  {product.isFeatured && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{product.productName}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold capitalize">
                    {product.productType}
                  </span>
                  {product.categoryId?.region && (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {product.categoryId.region}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                    product.status === 'approved' ? 'bg-green-100 text-green-700' :
                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating & Price Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-center">
                <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1 fill-yellow-500" />
                <p className="text-lg font-bold text-gray-900">{product.averageRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{product.totalRatings} ratings</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">${product.priceFrom}</p>
                <p className="text-xs text-gray-500">Starting Price</p>
              </div>
              {product.discountPriceFrom > 0 && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                  <Tag className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">${product.discountPriceFrom}</p>
                  <p className="text-xs text-gray-500">Discount Price</p>
                </div>
              )}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                <ShoppingCart className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{product.quantity}</p>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
            </div>

            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isHalal && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Halal
                </span>
              )}
              {product.isOrganic && (
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> Organic
                </span>
              )}
              {product.isFrozen && (
                <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Snowflake className="w-3 h-3" /> Frozen
                </span>
              )}
              {product.isKosher && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Kosher
                </span>
              )}
              {product.isAvailable && (
                <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Available
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Slug</p>
                  <p className="text-gray-900 font-medium text-sm truncate max-w-[140px]" title={product.slug}>{product.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Origin</p>
                  <p className="text-gray-900 font-medium text-sm">{product.originCountry || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Shelf Life</p>
                  <p className="text-gray-900 font-medium text-sm">{product.shelfLife || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Added By</p>
                  <p className="text-gray-900 font-medium text-sm capitalize">{product.addBy}</p>
                </div>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Variants</h4>
                <div className="space-y-2">
                  {product.variants.map((variant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">{variant.label}</p>
                        <p className="text-xs text-gray-500">{variant.stock} in stock • {variant.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${variant.price}</p>
                        {variant.discount > 0 && (
                          <p className="text-xs text-green-600">-{variant.discount}% (${variant.discountPrice})</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.shortDescription && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Short Description</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">{product.shortDescription}</p>
              </div>
            )}

            {product.description && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Full Description</h4>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border max-h-32 overflow-y-auto" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* SEO Info */}
            {product.seo && (product.seo.metaTitle || product.seo.metaDescription) && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">SEO Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg border space-y-2">
                  {product.seo.metaTitle && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Meta Title</p>
                      <p className="text-sm text-gray-700">{product.seo.metaTitle}</p>
                    </div>
                  )}
                  {product.seo.metaDescription && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Meta Description</p>
                      <p className="text-sm text-gray-700">{product.seo.metaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created: {formatDate(product.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated: {formatDate(product.updatedAt)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Product details not available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;