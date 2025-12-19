/* eslint-disable @next/next/no-img-element */
// src/components/OrderDetailsClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  RefreshCw,
  Image as ImageIcon,
  Phone,
  Mail,
  Download,
  Share2,
  MessageCircle,
} from "lucide-react";
// import Image from "next/image";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/catalog";
import { getOrder } from "@/lib/api/order";

const OrderDetailsClient = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await getOrder(orderId);
      if (res.error)
        throw new Error(res.message || "Failed to fetch order details");
      setOrder(res.order);
    } catch (e) {
      console.error(e);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && orderId) fetchOrderDetails();
    else if (!isAuthenticated) {
      setError("Please login to view order details");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, orderId]);

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
        return <CreditCard className="w-5 h-5" />;
      case "cod":
        return <Package className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const getProductInfo = (item: OrderItem) => {
    if (typeof item._product === "object" && item._product) {
      const product = item._product as Product;
      return {
        name: product.name || "Product",
        description: product.description || "",
        image: product.images?.[0] || null,
      };
    }
    return { name: "Product", description: "", image: null };
  };

  const steps = useMemo(
    () => [
      {
        key: "pending",
        label: "Order Placed",
        icon: Clock,
        description: "Your order has been successfully placed",
      },
      {
        key: "processing",
        label: "Processing",
        icon: RefreshCw,
        description: "We're preparing your order for shipment",
      },
      {
        key: "shipped",
        label: "Shipped",
        icon: Truck,
        description: "Your order is on its way to you",
      },
      {
        key: "delivered",
        label: "Delivered",
        icon: CheckCircle,
        description: "Your order has been delivered successfully",
      },
    ],
    []
  );

  const statusSteps = useMemo(() => {
    if (!order) return [];
    const currentIndex = steps.findIndex((s) => s.key === order.status);
    return steps.map((s, i) => ({
      ...s,
      isCompleted: i < currentIndex,
      isCurrent: i === currentIndex,
      isUpcoming: i > currentIndex,
    }));
  }, [order, steps]);

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

  if (error || !order) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || "Order not found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {error
                ? "Please try again later."
                : "The order you're looking for doesn't exist."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchOrderDetails} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => router.push("/orders")}>
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/orders")}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Orders</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Invoice</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <div className="rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Status
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(
                    order.status
                  )} self-start sm:self-auto`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="relative">
                {statusSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.key}
                      className="flex items-start mb-4 sm:mb-6 last:mb-0"
                    >
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 mr-3 sm:mr-4 relative flex-shrink-0">
                        {step.isCompleted ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        ) : step.isCurrent ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-0 sm:pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                          <h3
                            className={`font-semibold text-base sm:text-lg ${
                              step.isCompleted
                                ? "text-green-600"
                                : step.isCurrent
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </h3>
                          {step.isCompleted && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full self-start">
                              ✓ Completed
                            </span>
                          )}
                          {step.isCurrent && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full animate-pulse self-start">
                              🔄 In Progress
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs sm:text-sm ${
                            step.isCompleted
                              ? "text-green-600"
                              : step.isCurrent
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {step.description}
                        </p>

                        {step.isCurrent && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs sm:text-sm text-blue-700">
                              <strong>Current Status:</strong> Your order is
                              currently at this stage. We&apos;ll update you as
                              soon as it moves to the next step.
                            </p>
                          </div>
                        )}
                        {step.isCompleted && (
                          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs sm:text-sm text-green-700">
                              <strong>✓ Completed:</strong> This step has been
                              successfully completed.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                Order Items
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map((item, index) => {
                  const productInfo = getProductInfo(item);
                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
                        {productInfo.image ? (
                          <img
                            src={productInfo.image}
                            alt={productInfo.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target =
                                e.currentTarget as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 hidden" />
                      </div>

                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                          {productInfo.name}
                        </h3>
                        {productInfo.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                            {productInfo.description}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                          <div className="text-xs sm:text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Case Size:{" "}
                              {item.caseSize?.size
                                ? `${item.caseSize.size}g`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="text-center sm:text-right">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {formatCurrency(item.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.trackingNumber && (
              <div className="rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Tracking Information
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      Tracking Number
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 break-all">
                      {order.trackingNumber}
                    </div>
                  </div>
                </div>
                {order.shippingDate && (
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Shipped on:</span>{" "}
                    {formatDate(order.shippingDate)}
                  </div>
                )}
                {order.deliveryDate && (
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Delivered on:</span>{" "}
                    {formatDate(order.deliveryDate)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Total Units:</span>
                  <span className="font-medium">{order.totalUnits}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Total Cases:</span>
                  <span className="font-medium">{order.totalCases}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-cyan-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {getPaymentMethodIcon(order.paymentMethod)}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
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
                {order.paymentDetails?.razorpayOrderId && (
                  <div className="text-xs sm:text-sm text-gray-600 break-all">
                    <span className="font-medium">Order ID:</span>{" "}
                    {order.paymentDetails.razorpayOrderId}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="font-medium text-gray-900">
                  {order.shippingAddress.snapshot.fullName}
                </div>
                <div className="text-gray-600">
                  {order.shippingAddress.snapshot.street}
                </div>
                <div className="text-gray-600">
                  {order.shippingAddress.snapshot.city},{" "}
                  {order.shippingAddress.snapshot.state}{" "}
                  {order.shippingAddress.snapshot.postalCode}
                </div>
                <div className="text-gray-600">
                  {order.shippingAddress.snapshot.country}
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-3">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="break-all">
                    {order.shippingAddress.snapshot.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Chat with Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Call Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsClient;
