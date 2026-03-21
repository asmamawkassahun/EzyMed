import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./components/common/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import ChatPage from "./pages/ChatPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DoctorProfileCompletionPage from "./pages/DoctorProfileCompletionPage";
import DoctorPendingApprovalPage from "./pages/DoctorPendingApprovalPage";
import DoctorsListPage from "./pages/DoctorsListPage";
import DoctorDetailsPage from "./pages/DoctorDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyServicesPage from "./pages/MyServicesPage";
import DoctorBookingsPage from "./pages/DoctorBookingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AudioCallPage from "./pages/AudioCallPage";
import VideoCallPage from "./pages/VideoCallPage";
import PharmacyProfileCompletionPage from "./pages/PharmacyProfileCompletionPage";
import PharmacyStatusPage from "./pages/PharmacyStatusPage";
import HealthTrackerPage from "./pages/HealthTrackerPage";
import PatientReadingsPage from "./pages/PatientReadingsPage";
import PatientsListPage from "./pages/PatientsListPage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import DoctorOnboardingGuard from "./components/common/DoctorOnboardingGuard";
import PharmacyOnboardingGuard from "./components/common/PharmacyOnboardingGuard";
import { AgoraProvider } from "./contexts/AgoraContext";
import { GlobalCallDialog } from "./components/audio/GlobalCallDialog";
import { ToastContainer } from "react-toastify";
import PresenceHeartbeat from "./components/common/PresenceHeartbeat";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PresenceHeartbeat />
          <AgoraProvider>
            {/* Global Incoming Call Dialog - Works on all pages */}
            <GlobalCallDialog />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              pauseOnFocusLoss={false}
            />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <PharmacyOnboardingGuard>
                        <DashboardPage />
                      </PharmacyOnboardingGuard>
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <PharmacyOnboardingGuard>
                        <ProfilePage />
                      </PharmacyOnboardingGuard>
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />


              <Route
                path="/shop"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <ShopPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <CartPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <OrdersPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <CheckoutPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/chat"
                element={
                  <PrivateRoute allowedRoles={["patient", "doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <ErrorBoundary>
                        <ChatPage />
                      </ErrorBoundary>
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/manage/products"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <PharmacyOnboardingGuard>
                        <ProductManagementPage />
                      </PharmacyOnboardingGuard>
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/manage/orders"
                element={
                  <PrivateRoute>
                    <DoctorOnboardingGuard>
                      <PharmacyOnboardingGuard>
                        <OrderManagementPage />
                      </PharmacyOnboardingGuard>
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctor/complete-profile"
                element={
                  <PrivateRoute allowedRoles={["doctor"]}>
                    <DoctorOnboardingGuard>
                      <DoctorProfileCompletionPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctor/pending-approval"
                element={
                  <PrivateRoute allowedRoles={["doctor"]}>
                    <DoctorOnboardingGuard>
                      <DoctorPendingApprovalPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />


              <Route
                path="/doctors"
                element={
                  <PrivateRoute allowedRoles={["patient"]}>
                    <DoctorOnboardingGuard>
                      <DoctorsListPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctors/:doctorId"
                element={
                  <PrivateRoute allowedRoles={["patient"]}>
                    <DoctorOnboardingGuard>
                      <DoctorDetailsPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/bookings"
                element={
                  <PrivateRoute allowedRoles={["patient"]}>
                    <DoctorOnboardingGuard>
                      <MyBookingsPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctor/services"
                element={
                  <PrivateRoute allowedRoles={["doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <MyServicesPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctor/bookings"
                element={
                  <PrivateRoute allowedRoles={["doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <DoctorBookingsPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctor/patients"
                element={
                  <PrivateRoute allowedRoles={["doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <PatientsListPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <PrivateRoute allowedRoles={["patient", "doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <PharmacyOnboardingGuard>
                        <NotificationsPage />
                      </PharmacyOnboardingGuard>
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/audio-call"
                element={
                  <PrivateRoute allowedRoles={["patient", "doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <AudioCallPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/video-call"
                element={
                  <PrivateRoute allowedRoles={["patient", "doctor", "admin"]}>
                    <DoctorOnboardingGuard>
                      <VideoCallPage />
                    </DoctorOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/pharmacy/complete-profile"
                element={
                  <PrivateRoute allowedRoles={["pharmacy"]}>
                    <PharmacyOnboardingGuard>
                      <PharmacyProfileCompletionPage />
                    </PharmacyOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/pharmacy/pending-approval"
                element={
                  <PrivateRoute allowedRoles={["pharmacy", "admin"]}>
                    <PharmacyOnboardingGuard>
                      <PharmacyStatusPage />
                    </PharmacyOnboardingGuard>
                  </PrivateRoute>
                }
              />

              <Route
                path="/health-tracker"
                element={
                  <PrivateRoute allowedRoles={["patient", "admin"]}>
                    <HealthTrackerPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/patients/:patientId/readings"
                element={
                  <PrivateRoute allowedRoles={["doctor", "admin"]}>
                    <PatientReadingsPage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AgoraProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
