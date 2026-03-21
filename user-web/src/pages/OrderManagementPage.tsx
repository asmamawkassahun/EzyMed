import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/layout/Layout";
import Dialog from "../components/common/Dialog";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Mail,
  Phone as PhoneIcon,
  Filter,
  Store,
  BadgeCheck,
} from "lucide-react";
import { Order } from "../types";
import { useShopStore } from "../stores/shop.store";
import { toast } from "react-toastify";
import Skeleton from "../components/common/Skeleton";
import { getRenderableImageUrl } from "../utils/image";

const OrderManagementPage: React.FC = () => {
  const { profile } = useAuth();
  const allOrders = useShopStore((state) => state.orders);
  const loading = useShopStore((state) => state.ordersLoading);
  const fetchOrders = useShopStore((state) => state.fetchOrders);
  const updateOrderStatus = useShopStore((state) => state.updateOrderStatus);
  const reviewOrderPayment = useShopStore((state) => state.reviewOrderPayment);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(false);
  const [viewFilter, setViewFilter] = useState<"all" | "my_products">(
    "my_products",
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentOrder, setSelectedPaymentOrder] =
    useState<Order | null>(null);
  const [paymentReviewStatus, setPaymentReviewStatus] = useState<
    "approved" | "rejected"
  >("approved");
  const [paymentRejectionReason, setPaymentRejectionReason] = useState("");
  const myProductOrders = useMemo(() => {
    if (!profile) return [] as Order[];

    // Backend currently allows doctors and admins to operate all orders.
    if (profile.role === "admin" || profile.role === "doctor") {
      return allOrders;
    }

    return allOrders.filter((order) =>
      (order.order_items || []).some(
        (item) => item.products?.created_by === profile.id,
      ),
    );
  }, [allOrders, profile]);

  const orders = viewFilter === "my_products" ? myProductOrders : allOrders;

  const [updateData, setUpdateData] = useState({
    order_status: "",
    tracking_number: "",
    notes: "",
  });

  const filterBtnInactive =
    "rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800";
  const filterBtnActive =
    "rounded-xl border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20";

  useEffect(() => {
    fetchOrders("all");
  }, [fetchOrders]);

  useEffect(() => {
    if (!profile) return;

    if (profile.role === "admin" || profile.role === "doctor") {
      setViewFilter("all");
      return;
    }

    setViewFilter("my_products");
  }, [profile]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingOrder(true);

    try {
      const response = await updateOrderStatus(selectedOrder.id, {
        order_status: updateData.order_status,
        tracking_number: updateData.tracking_number,
        notes: updateData.notes,
      });

      console.log("Update response:", response);
      toast.success("Order updated successfully.");

      setShowDialog(false);
      setSelectedOrder(null);
      setUpdateData({ order_status: "", tracking_number: "", notes: "" });
    } catch (error: any) {
      console.error("Failed to update order:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to update order. Please try again.",
      );
    } finally {
      setUpdatingOrder(false);
    }
  };

  const openUpdateDialog = (order: Order) => {
    if (isTerminalOrderStatus(order.order_status)) {
      toast.info("Delivered or cancelled orders can no longer be updated.");
      return;
    }

    if (!canUpdateOrder(order)) {
      toast.info("You do not have permission to update this order.");
      return;
    }

    setSelectedOrder(order);
    setUpdateData({
      order_status: order.order_status,
      tracking_number: order.tracking_number || "",
      notes: order.notes || "",
    });
    setShowDialog(true);
  };

  // Check if user can update a specific order
  const canUpdateOrder = (order: Order) => {
    if (!profile) return false;

    // Admin and doctor can update all orders.
    if (profile.role === "admin" || profile.role === "doctor") {
      return true;
    }

    // Counselor can only update orders containing their products.
    if (profile.role === "counselor") {
      const hasMyProducts = order.order_items?.some(
        (item) => item.products?.created_by === profile.id,
      );
      return hasMyProducts || false;
    }

    return false;
  };

  // Get products in order that belong to current user
  const getMyProductsInOrder = (order: Order) => {
    if (!profile) return [];
    return (
      order.order_items?.filter(
        (item) => item.products?.created_by === profile.id,
      ) || []
    );
  };

  const isTerminalOrderStatus = (status: string) =>
    status === "delivered" || status === "cancelled";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <Package className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/25 text-amber-800 dark:text-amber-300 border-amber-200/90 dark:border-amber-800/50";
      case "confirmed":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border-primary-200/90 dark:border-primary-800/50";
      case "shipped":
        return "bg-sky-100 dark:bg-sky-900/25 text-sky-800 dark:text-sky-300 border-sky-200/90 dark:border-sky-800/50";
      case "delivered":
        return "bg-emerald-100 dark:bg-emerald-900/25 text-emerald-800 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800/50";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/25 text-red-800 dark:text-red-300 border-red-200/90 dark:border-red-800/50";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "pending":
      case "pending_review":
      case "unpaid":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      case "failed":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
    }
  };

  const openPaymentReviewDialog = (
    order: Order,
    status: "approved" | "rejected",
  ) => {
    setSelectedPaymentOrder(order);
    setPaymentReviewStatus(status);
    setPaymentRejectionReason("");
    setPaymentDialogOpen(true);
  };

  const handlePaymentReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPaymentOrder) return;

    if (paymentReviewStatus === "rejected" && !paymentRejectionReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }

    try {
      setReviewingOrder(true);
      const response = await reviewOrderPayment(selectedPaymentOrder.id, {
        status: paymentReviewStatus,
        rejection_reason:
          paymentReviewStatus === "rejected"
            ? paymentRejectionReason.trim()
            : undefined,
      });

      toast.success(response.message || "Payment review updated.");
      setPaymentDialogOpen(false);
      setSelectedPaymentOrder(null);
      setPaymentRejectionReason("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to review payment.");
    } finally {
      setReviewingOrder(false);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.order_status === statusFilter);

  if (
    !profile ||
    (profile.role !== "pharmacy" &&
      profile.role !== "admin" &&
      profile.role !== "counselor")
  ) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Package className="h-7 w-7 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Access denied
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You need pharmacy, admin, or counselor privileges to manage orders.
          </p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl space-y-6 py-2">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-28 rounded-xl" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900/60"
            >
              <div className="border-b border-slate-200/80 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-9 w-32 rounded-full" />
                </div>
              </div>
              <div className="space-y-3 p-6">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8 py-2">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900 p-6 text-white shadow-lg shadow-primary-900/15 sm:p-8 dark:border-slate-700/50">
          <div
            className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_0%_100%,rgba(94,234,212,0.3),transparent_50%)]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Package className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
                  Fulfillment
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Order management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/85">
                  Review payments, update status, and track every line item in
                  one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Filter className="h-5 w-5 shrink-0" aria-hidden />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                View
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setViewFilter("my_products")}
                className={`inline-flex cursor-pointer items-center gap-2 ${
                  viewFilter === "my_products"
                    ? filterBtnActive
                    : filterBtnInactive
                }`}
              >
                <Store className="h-4 w-4" aria-hidden />
                My products
              </button>
              {(profile.role === "admin" || profile.role === "pharmacy") && (
                <button
                  type="button"
                  onClick={() => setViewFilter("all")}
                  className={`cursor-pointer ${
                    viewFilter === "all" ? filterBtnActive : filterBtnInactive
                  }`}
                >
                  All orders
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Filter by status
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "pending",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`cursor-pointer rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  statusFilter === status
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                    : "border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-1.5 tabular-nums opacity-80">
                    ({orders.filter((o) => o.order_status === status).length})
                  </span>
                )}
                {status === "all" && (
                  <span className="ml-1.5 tabular-nums opacity-80">
                    ({orders.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-900/50">
            <Package
              className="mx-auto mb-4 h-16 w-16 text-slate-300 dark:text-slate-600"
              aria-hidden
            />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No orders found
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {viewFilter === "my_products"
                ? "No orders containing your products yet."
                : statusFilter === "all"
                  ? "No orders have been placed yet."
                  : `No ${statusFilter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const myProducts = getMyProductsInOrder(order);
              const canUpdate =
                canUpdateOrder(order) &&
                !isTerminalOrderStatus(order.order_status);

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <div className="border-b border-slate-200/80 bg-linear-to-r from-slate-50 to-white p-6 dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-900/40">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Order #{order.id.substring(0, 8).toUpperCase()}
                          </h3>
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(order.order_status)}`}
                          >
                            {getStatusIcon(order.order_status)}
                            <span className="capitalize">
                              {order.order_status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}
                        >
                          Payment: {order.payment_status}
                        </span>
                        {myProducts.length > 0 && (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Your products: {myProducts.length}
                          </span>
                        )}
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total
                          </p>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            ${order.total_price.toFixed(2)}
                          </p>
                        </div>
                        {canUpdate && (
                          <button
                            type="button"
                            onClick={() => openUpdateDialog(order)}
                            className="cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition hover:bg-primary-700"
                          >
                            Update status
                          </button>
                        )}
                      </div>
                    </div>

                    {order.tracking_number && (
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <Truck
                          className="h-4 w-4 text-slate-500 dark:text-slate-400"
                          aria-hidden
                        />
                        <span className="text-slate-600 dark:text-slate-400">
                          Tracking:
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {order.tracking_number}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {order.profiles && (
                      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                        <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                          <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          Customer information
                        </h4>
                        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {order.profiles.full_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {order.profiles.email}
                            </span>
                          </div>
                          {order.profiles.phone && (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-700 dark:text-slate-300">
                                {order.profiles.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {order.order_items && order.order_items.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          Order items
                        </h4>
                        {order.order_items.map((item, index) => {
                          const isMyProduct =
                            item.products?.created_by === profile.id;
                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-4 rounded-xl border p-4 ${
                                isMyProduct
                                  ? "border-primary-200/90 bg-primary-50/80 dark:border-primary-800/60 dark:bg-primary-950/25"
                                  : "border-slate-200/70 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/30"
                              }`}
                            >
                              {item.products?.image_url && (
                                <img
                                  src={getRenderableImageUrl(
                                    item.products.image_url,
                                  )}
                                  alt={item.products.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-semibold text-slate-900 dark:text-white">
                                    {item.products?.title || "Product"}
                                  </h5>
                                  {isMyProduct && (
                                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
                                      Yours
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {item.quantity} × $
                                  {item.unit_price.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                ${(item.unit_price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {order.shipping_address && (
                      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                        <div className="mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                          <h5 className="font-bold text-slate-900 dark:text-white">
                            Shipping address
                          </h5>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {order.shipping_address.address}
                          <br />
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.zipCode}
                          <br />
                          {order.shipping_address.country}
                          {order.shipping_address.phone && (
                            <>
                              <br />
                              Phone: {order.shipping_address.phone}
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mt-4 rounded-2xl border border-primary-200/80 bg-primary-50/60 p-4 dark:border-primary-800/50 dark:bg-primary-950/20">
                        <h5 className="mb-1 font-bold text-slate-900 dark:text-white">
                          Order notes
                        </h5>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {order.payment_method === "proof_upload" && (
                      <div className="mt-4 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h5 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                              <BadgeCheck className="h-4 w-4 text-primary-600" />{" "}
                              Payment proof
                            </h5>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                              Method: proof_upload • Status:{" "}
                              {order.payment_status}
                            </p>
                            {order.payment_submitted_at && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Submitted:{" "}
                                {new Date(
                                  order.payment_submitted_at,
                                ).toLocaleString(undefined, { timeZone: 'Africa/Addis_Ababa' })}
                              </p>
                            )}
                            {order.payment_document_url && (
                              <a
                                href={order.payment_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                              >
                                Open uploaded proof
                              </a>
                            )}
                            {order.payment_rejection_reason && (
                              <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                                Rejection reason:{" "}
                                {order.payment_rejection_reason}
                              </p>
                            )}
                          </div>

                          {canUpdate &&
                            (order.payment_status === "pending" ||
                              order.payment_status === "pending_review") && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openPaymentReviewDialog(order, "approved")
                                  }
                                  className="rounded-xl border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/25"
                                >
                                  Approve payment
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openPaymentReviewDialog(order, "rejected")
                                  }
                                  className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/25"
                                >
                                  Reject payment
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog
          isOpen={paymentDialogOpen}
          onClose={() => {
            setPaymentDialogOpen(false);
            setSelectedPaymentOrder(null);
            setPaymentRejectionReason("");
          }}
          title={`${paymentReviewStatus === "approved" ? "Approve" : "Reject"} Payment #${selectedPaymentOrder?.id.substring(0, 8).toUpperCase() || ""}`}
        >
          <form onSubmit={handlePaymentReviewSubmit} className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {paymentReviewStatus === "approved"
                ? "Approving this proof will mark payment as paid and confirm the order."
                : "Rejecting this proof keeps the order pending and records your reason."}
            </p>

            {paymentReviewStatus === "rejected" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Rejection reason *
                </label>
                <textarea
                  value={paymentRejectionReason}
                  onChange={(event) =>
                    setPaymentRejectionReason(event.target.value)
                  }
                  placeholder="Explain why this proof is rejected"
                  rows={3}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-950/50 dark:text-white"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentDialogOpen(false);
                  setSelectedPaymentOrder(null);
                  setPaymentRejectionReason("");
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reviewingOrder}
                className="flex-1 cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 disabled:opacity-60"
              >
                {reviewingOrder
                  ? "Saving..."
                  : paymentReviewStatus === "approved"
                    ? "Approve"
                    : "Reject"}
              </button>
            </div>
          </form>
        </Dialog>

        <Dialog
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false);
            setSelectedOrder(null);
            setUpdateData({ order_status: "", tracking_number: "", notes: "" });
          }}
          title={`Update Order #${selectedOrder?.id.substring(0, 8).toUpperCase()}`}
        >
          <form onSubmit={handleUpdateOrder} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Order status *
              </label>
              <select
                value={updateData.order_status}
                onChange={(e) =>
                  setUpdateData({ ...updateData, order_status: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-950/50 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tracking number
              </label>
              <input
                type="text"
                value={updateData.tracking_number}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    tracking_number: e.target.value,
                  })
                }
                placeholder="Enter tracking number"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-950/50 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Notes
              </label>
              <textarea
                value={updateData.notes}
                onChange={(e) =>
                  setUpdateData({ ...updateData, notes: e.target.value })
                }
                placeholder="Add notes about this order..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-950/50 dark:text-white"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowDialog(false);
                  setSelectedOrder(null);
                  setUpdateData({
                    order_status: "",
                    tracking_number: "",
                    notes: "",
                  });
                }}
                className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingOrder}
                className="flex-1 cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 disabled:opacity-60"
              >
                {updatingOrder ? "Updating…" : "Update order"}
              </button>
            </div>
          </form>
        </Dialog>
      </div>
    </Layout>
  );
};

export default OrderManagementPage;
