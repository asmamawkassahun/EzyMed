import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Booking, DoctorService, Order } from "../types";
import {
  ArrowRight,
  ShoppingBag,
  BriefcaseMedical,
  ClipboardCheck,
  CalendarClock,
  CircleAlert,
  HeartPulse,
  ShieldPlus,
  Stethoscope,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useDashboardStore } from "../stores/dashboard.store";
import Skeleton from "../components/common/Skeleton";
import { doctorServiceService } from "../services/doctor-service.service";
import { bookingService } from "../services/booking.service";
import { doctorDiscoveryService } from "../services/doctor-discovery.service";
import { shopService } from "../services/shop.service";

const pageSection =
  "rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm p-6 sm:p-7 shadow-sm";
const heroShell =
  "relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900 p-8 sm:p-10 text-white shadow-lg shadow-primary-900/15";

const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const fetchDashboardData = useDashboardStore(
    (state) => state.fetchDashboardData,
  );
  const [doctorServices, setDoctorServices] = useState<DoctorService[]>([]);
  const [doctorUpcomingBookings, setDoctorUpcomingBookings] = useState<
    Booking[]
  >([]);
  const [doctorSummaryLoading, setDoctorSummaryLoading] = useState(false);
  const [patientBookingsLoading, setPatientBookingsLoading] = useState(false);
  const [patientBookings, setPatientBookings] = useState<Booking[]>([]);
  const [trustedDoctors, setTrustedDoctors] = useState<
    Array<{
      id: string;
      full_name: string;
      status: "online" | "offline" | "away";
      last_seen: string | null;
      bookings_count: number;
    }>
  >([]);

  const [pharmacyProducts, setPharmacyProducts] = useState<any[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<Order[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    fetchDashboardData(false, false);
  }, [profile, fetchDashboardData]);

  useEffect(() => {
    const loadDoctorSummary = async () => {
      if (!profile || profile.role !== "doctor") {
        setDoctorServices([]);
        setDoctorUpcomingBookings([]);
        return;
      }

      try {
        setDoctorSummaryLoading(true);
        const [services, bookings] = await Promise.all([
          doctorServiceService.listMyServices(),
          bookingService.listDoctorBookings({ type: "upcoming", limit: 100 }),
        ]);

        setDoctorServices(services);
        setDoctorUpcomingBookings(bookings);
      } catch {
        setDoctorServices([]);
        setDoctorUpcomingBookings([]);
      } finally {
        setDoctorSummaryLoading(false);
      }
    };

    loadDoctorSummary();
  }, [profile]);

  useEffect(() => {
    const loadPatientJourney = async () => {
      if (!profile || profile.role !== "patient") {
        setPatientBookings([]);
        setTrustedDoctors([]);
        return;
      }

      try {
        setPatientBookingsLoading(true);
        const bookings = await bookingService.listMyBookings({ limit: 100 });
        setPatientBookings(bookings);

        const counts = new Map<string, number>();
        for (const booking of bookings) {
          counts.set(
            booking.doctor_id,
            (counts.get(booking.doctor_id) || 0) + 1,
          );
        }
        const doctorIds = Array.from(counts.keys());
        if (!doctorIds.length) {
          setTrustedDoctors([]);
          return;
        }

        const presence =
          await doctorDiscoveryService.getDoctorsPresence(doctorIds);
        const presenceMap = new Map(
          presence.map((doctor) => [doctor.id, doctor]),
        );

        const trusted = doctorIds
          .map((id) => {
            const profileData = presenceMap.get(id);
            return {
              id,
              full_name: profileData?.full_name || `Dr. ${id.slice(0, 8)}`,
              status: (profileData?.status || "offline") as
                | "online"
                | "offline"
                | "away",
              last_seen: profileData?.last_seen || null,
              bookings_count: counts.get(id) || 0,
            };
          })
          .sort((a, b) => b.bookings_count - a.bookings_count)
          .slice(0, 4);

        setTrustedDoctors(trusted);
      } catch {
        setPatientBookings([]);
        setTrustedDoctors([]);
      } finally {
        setPatientBookingsLoading(false);
      }
    };

    loadPatientJourney();
  }, [profile]);

  useEffect(() => {
    const loadPharmacyDashboard = async () => {
      if (!profile || profile.role !== "pharmacy") {
        setPharmacyProducts([]);
        setPharmacyOrders([]);
        return;
      }

      try {
        setPharmacyLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          shopService.getMyProducts(),
          shopService.getOrders(),
        ]);
        setPharmacyProducts(productsRes.products || []);
        setPharmacyOrders(ordersRes.orders || []);
      } catch (err) {
        console.error("loadPharmacyDashboard error:", err);
        setPharmacyProducts([]);
        setPharmacyOrders([]);
      } finally {
        setPharmacyLoading(false);
      }
    };

    loadPharmacyDashboard();
  }, [profile]);

  if (!profile) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl space-y-8">
          <div
            className={`${pageSection} border-dashed border-slate-300/80 dark:border-slate-600/80`}
          >
            <Skeleton className="h-8 w-72" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-56" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-44 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  const activeDoctorServices = doctorServices.filter(
    (service) => service.is_active,
  );
  const pendingConfirmationQueue = doctorUpcomingBookings
    .filter((booking) => booking.status === "pending_confirmation")
    .sort(
      (a, b) =>
        new Date(a.scheduled_start).getTime() -
        new Date(b.scheduled_start).getTime(),
    );
  const confirmedBookings = doctorUpcomingBookings.filter(
    (booking) => booking.status === "confirmed",
  );
  const todayDateIso = new Date().toISOString().slice(0, 10);
  const todaysBookings = doctorUpcomingBookings.filter(
    (booking) => booking.scheduled_start.slice(0, 10) === todayDateIso,
  );
  const patientUpcomingBookings = patientBookings
    .filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.scheduled_start).getTime() >= Date.now(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_start).getTime() -
        new Date(b.scheduled_start).getTime(),
    );

  const formatStatusLabel = (status: Booking["status"]) =>
    status.replace(/_/g, " ");

  const statCardBase =
    "rounded-2xl border p-5 sm:p-6 transition-shadow hover:shadow-md";
  const statCardNeutral = `${statCardBase} border-slate-200/90 bg-white dark:border-slate-700/80 dark:bg-slate-900/80`;
  const statCardAmber = `${statCardBase} border-amber-200/80 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/25`;
  const statCardSky = `${statCardBase} border-sky-200/80 bg-sky-50/90 dark:border-sky-900/35 dark:bg-sky-950/20`;
  const statCardEmerald = `${statCardBase} border-emerald-200/80 bg-emerald-50/90 dark:border-emerald-900/35 dark:bg-emerald-950/20`;

  const renderPatientDashboard = () => (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className={heroShell}>
        <div
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_80%_0%,rgba(56,189,248,0.35),transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
              Your dashboard
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              Care journey, {profile.full_name}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
              Next appointments, your doctors, and shortcuts to essentials—one
              calm overview.
            </p>
          </div>
        </div>
      </div>

      <section className={pageSection}>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300">
            <CalendarClock className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upcoming appointments
          </h3>
        </div>

        {patientBookingsLoading ? (
          <Skeleton className="h-28 w-full rounded-2xl" />
        ) : patientUpcomingBookings.length > 0 ? (
          <>
            <div className="space-y-3">
              {patientUpcomingBookings.slice(0, 3).map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() =>
                    navigate("/bookings", {
                      state: { openBookingId: booking.id },
                    })
                  }
                  className="w-full cursor-pointer rounded-2xl border border-primary-200/60 bg-primary-50/50 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-primary-800/50 dark:bg-primary-950/20"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {booking.service_title_snapshot}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {new Date(booking.scheduled_start).toLocaleString(
                      undefined,
                      { timeZone: "Africa/Addis_Ababa" },
                    )}{" "}
                    • {booking.service_mode}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-200/80 dark:bg-slate-800 dark:text-primary-300 dark:ring-primary-800">
                    {formatStatusLabel(booking.status)}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/doctors")}
                className="cursor-pointer rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:bg-primary-700"
              >
                Find doctors
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 dark:border-slate-600 dark:bg-slate-800/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No upcoming appointments yet.
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Book a trusted doctor to start your next care step.
            </p>
            <button
              type="button"
              onClick={() => navigate("/doctors")}
              className="mt-4 cursor-pointer rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
            >
              Find doctors
            </button>
          </div>
        )}
      </section>

      <section className={pageSection}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
              <Stethoscope className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Trusted doctors
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="cursor-pointer text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            Browse all
          </button>
        </div>

        {patientBookingsLoading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : trustedDoctors.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your trusted doctor list will appear after your first booking.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {trustedDoctors.map((doctorItem) => (
              <button
                key={doctorItem.id}
                type="button"
                onClick={() => navigate(`/doctors/${doctorItem.id}`)}
                className="cursor-pointer rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {doctorItem.full_name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      doctorItem.status === "online"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : doctorItem.status === "away"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {doctorItem.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {doctorItem.bookings_count} booking
                  {doctorItem.bookings_count > 1 ? "s" : ""} together
                </p>
                <p className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  View services &amp; book
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={pageSection}>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300">
            <ShieldPlus className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Essentials
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/30"
          >
            <HeartPulse className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              My care sessions
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/30"
          >
            <MessageCircle className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              Contact doctors
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/30"
          >
            <ShoppingBag className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              Care essentials shop
            </p>
          </button>
        </div>
      </section>
    </div>
  );

  const renderPharmacyDashboard = () => (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className={heroShell}>
        <div
          className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_80%,rgba(94,234,212,0.35),transparent_45%)]"
          aria-hidden
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
            Pharmacy console
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back, {profile.full_name}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
            Catalog health, fulfill orders, and keep patients moving—without
            losing the thread.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pharmacyLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full rounded-2xl" />
          ))
        ) : (
          <>
            <article className={statCardNeutral}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total products
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {pharmacyProducts.length}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {pharmacyProducts.filter((p) => !p.is_out_of_stock).length} in
                stock
              </p>
            </article>

            <article className={statCardAmber}>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Pending orders
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-amber-900 dark:text-amber-200">
                {
                  pharmacyOrders.filter(
                    (o) =>
                      o.order_status === "pending" ||
                      o.order_status === "confirmed",
                  ).length
                }
              </p>
              <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-200/90">
                Needs your action
              </p>
            </article>

            <article className={statCardSky}>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                Shipped
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-sky-900 dark:text-sky-200">
                {pharmacyOrders.filter((o) => o.order_status === "shipped").length}
              </p>
              <p className="mt-1 text-sm text-sky-800/90 dark:text-sky-200/90">
                In transit
              </p>
            </article>

            <article className={statCardEmerald}>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Completed
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-900 dark:text-emerald-200">
                {
                  pharmacyOrders.filter((o) => o.order_status === "delivered")
                    .length
                }
              </p>
              <p className="mt-1 text-sm text-emerald-800/90 dark:text-emerald-200/90">
                Delivered successfully
              </p>
            </article>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/manage/products")}
          className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950/50">
              <ShoppingBag className="h-5 w-5 text-primary-700 dark:text-primary-300" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Inventory management
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Add or edit products, stock levels, and categories.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
            Manage inventory{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/manage/orders")}
          className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/40">
              <ClipboardCheck className="h-5 w-5 text-sky-700 dark:text-sky-300" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Fulfillment desk
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Process orders, shipping status, and customer context.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
            Manage orders{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </p>
        </button>
      </section>

      <section className={pageSection}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950/50">
              <ShoppingBag className="h-5 w-5 text-primary-700 dark:text-primary-300" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent sales orders
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate("/manage/orders")}
            className="cursor-pointer text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            View all
          </button>
        </div>

        {pharmacyLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : pharmacyOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center dark:border-slate-600 dark:bg-slate-800/40">
            <CircleAlert
              className="mx-auto h-9 w-9 text-slate-400"
              aria-hidden
            />
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              No orders yet.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              New orders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pharmacyOrders.slice(0, 5).map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Order #{order.id.slice(0, 8)} • ETB {order.total_price}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {order.order_items?.length} items •{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      order.order_status === "delivered"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : order.order_status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderCounselorDashboard = () => renderPatientDashboard();
  const renderDoctorDashboard = () => (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className={heroShell}>
        <div
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_0%_50%,rgba(56,189,248,0.3),transparent_50%)]"
          aria-hidden
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
            Clinician workspace
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back, Dr. {profile.full_name}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
            Services, confirmations, and today&apos;s sessions—prioritized for
            fast decisions.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {doctorSummaryLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full rounded-2xl" />
          ))
        ) : (
          <>
            <article className={statCardNeutral}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active services
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {activeDoctorServices.length}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {doctorServices.length} total configured
              </p>
            </article>

            <article className={statCardAmber}>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Pending confirmations
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-amber-900 dark:text-amber-200">
                {pendingConfirmationQueue.length}
              </p>
              <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-200/90">
                Awaiting your action
              </p>
            </article>

            <article className={statCardSky}>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                Upcoming confirmed
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-sky-900 dark:text-sky-200">
                {confirmedBookings.length}
              </p>
              <p className="mt-1 text-sm text-sky-800/90 dark:text-sky-200/90">
                On the calendar ahead
              </p>
            </article>

            <article className={statCardEmerald}>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Today&apos;s sessions
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-900 dark:text-emerald-200">
                {todaysBookings.length}
              </p>
              <p className="mt-1 text-sm text-emerald-800/90 dark:text-emerald-200/90">
                Scheduled for today
              </p>
            </article>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/doctor/services")}
          className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950/50">
              <BriefcaseMedical className="h-5 w-5 text-primary-700 dark:text-primary-300" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Manage services
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Pricing, modes, and availability so patients can book with clarity.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
            Open service desk{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/doctor/bookings")}
          className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/40">
              <ClipboardCheck className="h-5 w-5 text-sky-700 dark:text-sky-300" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Operate bookings
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Confirm, reschedule, complete, or cancel with full context.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
            Open booking queue{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </p>
        </button>
      </section>

      <section className={pageSection}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/30">
              <CalendarClock className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pending confirmation queue
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate("/doctor/bookings")}
            className="cursor-pointer text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            View all
          </button>
        </div>

        {doctorSummaryLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : pendingConfirmationQueue.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center dark:border-slate-600 dark:bg-slate-800/40">
            <CircleAlert
              className="mx-auto h-9 w-9 text-slate-400"
              aria-hidden
            />
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              No pending confirmations right now.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              New requests will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingConfirmationQueue.slice(0, 5).map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-amber-200/70 bg-amber-50/40 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/15"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {booking.service_title_snapshot}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {new Date(booking.scheduled_start).toLocaleString(
                        undefined,
                        { timeZone: "Africa/Addis_Ababa" },
                      )}{" "}
                      • {booking.service_mode}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-200/90 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                    pending confirmation
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderDashboardContent = () => {
    switch (profile.role) {
      case "patient":
        return renderPatientDashboard();
      case "counselor":
        return renderCounselorDashboard();
      case "doctor":
        return renderDoctorDashboard();
      case "pharmacy":
        return renderPharmacyDashboard();
      default:
        return (
          <div
            className={`mx-auto max-w-2xl ${pageSection} border-dashed border-slate-300 dark:border-slate-600`}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Welcome to EzyMed
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Your dashboard will appear here based on your role.
            </p>
          </div>
        );
    }
  };

  return <Layout>{renderDashboardContent()}</Layout>;
};

export default DashboardPage;
