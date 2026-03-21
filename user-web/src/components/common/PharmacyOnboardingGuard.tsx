import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import Skeleton from "./Skeleton";

const ALLOWED_ONBOARDING_PATHS = new Set([
  "/pharmacy/complete-profile",
  "/pharmacy/pending-approval",
]);

const isPharmacyProfileComplete = (
  pharmacyProfile: any | null,
  profileExtra: any,
) => {
  const profileHasSubmission =
    Boolean(profileExtra?.pharmacy_business_name) ||
    Boolean(profileExtra?.submitted_at) ||
    (Array.isArray(profileExtra?.verification_documents) &&
      profileExtra.verification_documents.length > 0);

  if (!pharmacyProfile) {
    return profileHasSubmission;
  }

  const hasBusinessName = Boolean(pharmacyProfile.business_name?.trim());
  const hasLicense = Boolean(pharmacyProfile.license_number?.trim());
  const hasBio = Boolean(pharmacyProfile.bio?.trim());
  
  const metadataDocs = pharmacyProfile.metadata?.verification_documents || [];
  const profileDocs = profileExtra?.verification_documents || [];
  const hasVerificationDocs = (Array.isArray(profileDocs) && profileDocs.length > 0) || 
                             (Array.isArray(metadataDocs) && metadataDocs.length > 0);

  return (
    profileHasSubmission ||
    (hasBusinessName && hasLicense && hasBio && hasVerificationDocs)
  );
};

interface PharmacyOnboardingGuardProps {
  children: React.ReactNode;
}

const PharmacyOnboardingGuard: React.FC<PharmacyOnboardingGuardProps> = ({
  children,
}) => {
  const location = useLocation();
  const { user, profile, loading } = useAuth();
  const [checking, setChecking] = useState(false);
  const [hasCheckedPharmacyProfile, setHasCheckedPharmacyProfile] = useState(false);
  const [pharmacyProfile, setPharmacyProfile] = useState<any | null>(null);
  const isPharmacy = profile?.role === "pharmacy";

  useEffect(() => {
    if (loading || !user || !isPharmacy) {
      return;
    }

    let active = true;
    const loadPharmacyProfile = async () => {
      setHasCheckedPharmacyProfile(false);
      setChecking(true);
      try {
        const res = await api.get("/pharmacy/me");
        if (active) {
          setPharmacyProfile(res.data);
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          if (active) {
            setPharmacyProfile(null);
          }
        }
      } finally {
        if (active) {
          setChecking(false);
          setHasCheckedPharmacyProfile(true);
        }
      }
    };

    loadPharmacyProfile();
    return () => {
      active = false;
    };
  }, [loading, user?.id, isPharmacy]);

  const pharmacyCompletedProfile = useMemo(
    () => isPharmacyProfileComplete(pharmacyProfile, profile?.extra),
    [pharmacyProfile, profile?.extra],
  );

  if (!isPharmacy) {
    return <>{children}</>;
  }

  if (checking || !hasCheckedPharmacyProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const isOnOnboardingPage = ALLOWED_ONBOARDING_PATHS.has(location.pathname);

  if (
    !pharmacyCompletedProfile &&
    location.pathname !== "/pharmacy/complete-profile"
  ) {
    return <Navigate to="/pharmacy/complete-profile" replace />;
  }

  if (pharmacyCompletedProfile && profile?.role_status !== "approved") {
    if (!isOnOnboardingPage) {
      return <Navigate to="/pharmacy/pending-approval" replace />;
    }
  }

  if (
    pharmacyCompletedProfile &&
    profile?.role_status === "approved" &&
    isOnOnboardingPage
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PharmacyOnboardingGuard;
