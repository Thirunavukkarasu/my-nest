import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.login(email, password);

      if (response.error) {
        Alert.alert("Error", response.error || "Invalid credentials");
        return;
      }

      // Store token and user data
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
      }

      // Update Zustand store with user, token, and permissions
      if (response.data?.user && response.data?.token) {
        const user = response.data.user;
        const permissions = user.permissions || [];

        setAuth(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            roleId: user.roleId,
            roleName: user.roleName,
            createdAt: user.createdAt,
          },
          response.data.token,
          permissions
        );
      }

      // Navigate to appropriate layout based on role
      if (response.data?.user) {
        const loggedInUser = response.data.user;
        const roleName = loggedInUser.roleName?.toLowerCase();
        const isAdmin =
          roleName === "admin" || roleName === "administrator" || !roleName;

        if (isAdmin) {
          router.replace("/(admin-tabs)" as any);
        } else {
          router.replace("/(resident-tabs)" as any);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-2">
            RR Enclave
          </Text>
          <Text className="text-lg text-gray-600">
            Apartment Management System
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Password
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`bg-blue-600 rounded-lg py-4 items-center mb-4 ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-semibold">Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
