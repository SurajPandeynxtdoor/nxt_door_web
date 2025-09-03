/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  Calendar,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/catalog";
import { getUserOrders } from "@/lib/api/order";
import Image from "next/image";

const MyOrdersClient = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserOrders();
      if (res.error) throw new Error(res.message || "Failed to fetch orders");
      setOrders(res.orders || []);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
    else setLoading(false);
  }, [isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "refunded":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "onlineTransfer":
        return <CreditCard className="w-4 h-4" />;
      case "cod":
        return <Package className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const getProductInfo = (item: OrderItem) => {
    if (item && typeof item._product === "object" && item._product) {
      const product = item._product as Product;
      return {
        name: product.name || "Product",
        image: product.images?.[0] || null,
      };
    }
    return { name: "Product", image: null };
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order._id.toLowerCase().includes(q) ||
        order.shippingAddress?.snapshot?.fullName
          ?.toLowerCase?.()
          .includes(q) ||
        order.shippingAddress?.snapshot?.city?.toLowerCase?.().includes(q);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              Track your orders and view order history
            </p>
          </div>
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <div className="rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders by ID, name, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, i) => {
                          const productInfo = getProductInfo(item);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                {productInfo.image ? (
                                  <Image
                                    src={productInfo.image}
                                    alt={productInfo.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      target.nextElementSibling?.classList.remove(
                                        "hidden"
                                      );
                                    }}
                                  />
                                ) : null}
                                <ImageIcon className="w-6 h-6 text-gray-400 hidden" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {productInfo.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Qty: {item.quantity} ×{" "}
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {order.items.length > 2 && (
                          <div className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">
                          {order.shippingAddress.snapshot.fullName}
                        </div>
                        <div>
                          {order.shippingAddress.snapshot.street},{" "}
                          {order.shippingAddress.snapshot.city}
                        </div>
                        <div>
                          {order.shippingAddress.snapshot.state},{" "}
                          {order.shippingAddress.snapshot.postalCode}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        {getPaymentMethodIcon(order.paymentMethod)}
                        Payment
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                            order.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Summary
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Total Amount:</span>
                          <span className="font-medium">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Units:</span>
                          <span>{order.totalUnits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Cases:</span>
                          <span>{order.totalCases}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>Tracking Number: {order.trackingNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg shadow-sm p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || statusFilter !== "all"
                  ? "No orders found"
                  : "No orders yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start shopping to see your orders here."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={() => router.push("/")}>Start Shopping</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersClient;
