import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isImpersonating = useAuthStore((state) => state.isImpersonating);
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);
  const initialize = useAuthStore((state) => state.initialize);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Small delay to let Zustand persist middleware finish restoring
        await new Promise((resolve) => setTimeout(resolve, 100));
        await initialize();
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  // Show loading while initializing
  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If authenticated, redirect to appropriate layout based on role and impersonation
  if (isAuthenticated && user) {
    const roleName = user.roleName?.toLowerCase();
    const isAdmin =
      roleName === "admin" || roleName === "administrator" || !roleName;

    // If admin is impersonating AND has selected a flat, show resident view
    if (isImpersonating && isAdmin && impersonatedFlatId) {
      return <Redirect href={"/(resident-tabs)" as any} />;
    }

    // Otherwise, show appropriate view based on role
    if (isAdmin) {
      return <Redirect href={"/(admin-tabs)" as any} />;
    } else {
      return <Redirect href={"/(resident-tabs)" as any} />;
    }
  }

  // Not authenticated, redirect to login
  return <Redirect href="/login" />;
}
