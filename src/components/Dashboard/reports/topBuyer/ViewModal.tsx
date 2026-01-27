import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReportTopBuyersSingle } from "@/lib/hooks/useReport";
import { BuyerDetail, TopBuyer } from "@/lib/types/report";
import { Mail, ShoppingBag, CreditCard, User, Trophy } from "lucide-react";

interface ViewModalProps {
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  id: string;
}

const ViewModal = ({ viewModalOpen, setViewModalOpen, id }: ViewModalProps) => {
  const { data, isLoading } = useReportTopBuyersSingle(id);

  const topBuyerData: BuyerDetail | undefined = data?.data;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 animate-pulse">
            Loading buyer details...
          </p>
        </div>
      );
    }

    if (!topBuyerData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No buyer details found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 py-4">
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="text-4xl bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
            <User className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {topBuyerData.firstName} {topBuyerData.lastName}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Top Customer</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="w-5 h-5 text-gray-400" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 font-medium uppercase">
                Email Address
              </p>
              <p className="text-gray-900 font-medium truncate">
                {topBuyerData.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Total Orders
                </p>
                <p className="text-gray-900 font-bold text-lg">
                  {topBuyerData.totalOrder}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <CreditCard className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Total Spent
                </p>
                <p className="text-gray-900 font-bold text-lg">
                  {topBuyerData.totalSpent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="mt-8">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-teal-600" />
            Recent Orders
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 font-semibold text-gray-600">
                    Order ID
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topBuyerData.recentOrders &&
                topBuyerData.recentOrders.length > 0 ? (
                  topBuyerData.recentOrders.map((order) => (
                    <tr key={order.orderUniqueId} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-medium text-gray-900">
                        {order.orderUniqueId}
                      </td>
                      <td className="px-3 py-3 text-gray-700">
                        ${order.totalPrice}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1">
                          {order?.paymentStatus === "paid" ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] w-fit font-medium ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] w-fit font-medium ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(order.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-teal-600" />
            Buyer Details
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;
