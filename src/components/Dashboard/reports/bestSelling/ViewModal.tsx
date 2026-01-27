import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Hash, DollarSign, Star, Trophy } from "lucide-react";

interface Product {
  rank: number;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: string;
  rating: number;
  icon: string;
}

interface ViewModalProps {
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  data: Product | null;
}

const ViewModal = ({ viewModalOpen, setViewModalOpen, data }: ViewModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-5 h-5 text-teal-600" />
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-4xl bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
                    {data.icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{data.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">Rank #{data.rank}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">SKU</p>
                        <p className="text-gray-900 font-medium">{data.sku}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Package className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Units Sold</p>
                            <p className="text-gray-900 font-bold text-lg">{data.unitsSold}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Revenue</p>
                            <p className="text-gray-900 font-bold text-lg">{data.revenue}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Rating</p>
                        <p className="text-gray-900 font-bold text-lg">{data.rating} / 5.0</p>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;