import { IconSymbol } from "@/components/ui/icon-symbol";
import { adaptFlat, adaptPayments, adaptResidents } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Flat, Payment, Resident } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FlatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [flat, setFlat] = useState<Flat | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadFlatDetails();
    }
  }, [id]);

  const loadFlatDetails = async () => {
    try {
      setLoading(true);

      // Get flat details with relations
      const flatsResponse = await apiClient.getFlats({
        page: 1,
        limit: 100,
        searchCriterias: [
          {
            columnName: "flatId",
            columnOperator: "equals",
            columnValue: parseInt(id!).toString(),
          },
        ],
        sortCriterias: [],
      });

      if (flatsResponse.error) {
        Alert.alert("Error", flatsResponse.error);
        router.back();
        return;
      }

      if (flatsResponse.data?.data && flatsResponse.data.data.length > 0) {
        const apiFlat = flatsResponse.data.data[0] as any;
        const adaptedFlat = adaptFlat(apiFlat);
        setFlat(adaptedFlat);

        // Extract residents and payments from the API response
        if (apiFlat.residents) {
          const adaptedResidents = adaptResidents(apiFlat.residents);
          setResidents(adaptedResidents);
        }

        if (apiFlat.payments) {
          const adaptedPayments = adaptPayments(apiFlat.payments);
          setPayments(adaptedPayments);
        }
      } else {
        Alert.alert("Error", "Flat not found");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load flat details");
      console.error("Error loading flat details:", error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4">Loading flat details...</Text>
      </View>
    );
  }

  if (!flat) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-gray-600 text-center mb-4">Flat not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              {flat.flatNumber}
            </Text>
            <Text className="text-lg text-gray-600 mt-1">
              Floor {flat.floor}
            </Text>
          </View>
          <View
            className={`px-3 py-2 rounded-lg ${
              flat.isOccupied ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-semibold ${
                flat.isOccupied ? "text-green-700" : "text-gray-600"
              }`}
            >
              {flat.isOccupied ? "Occupied" : "Vacant"}
            </Text>
          </View>
        </View>
      </View>

      {/* Flat Details */}
      <View className="bg-white mx-4 mt-4 rounded-lg p-4 mb-4">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Flat Details
        </Text>

        <View>
          <View className="flex-row justify-between py-2 border-b border-gray-100 mb-3">
            <Text className="text-gray-600">Status</Text>
            <Text className="font-semibold text-gray-900 capitalize">
              {flat.isOccupied ? "Occupied" : "Vacant"}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-100 mb-3">
            <Text className="text-gray-600">Floor</Text>
            <Text className="font-semibold text-gray-900">{flat.floor}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-100 mb-3">
            <Text className="text-gray-600">Flat Number</Text>
            <Text className="font-semibold text-gray-900">
              {flat.flatNumber}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Created</Text>
            <Text className="font-semibold text-gray-900">
              {formatDate(flat.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Residents Section */}
      <View className="bg-white mx-4 rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">
            Residents ({residents.length})
          </Text>
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to add resident screen
              Alert.alert("Info", "Add resident functionality coming soon");
            }}
            className="bg-blue-600 px-3 py-1.5 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-semibold ml-1">Add</Text>
          </TouchableOpacity>
        </View>

        {residents.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">
            No residents assigned to this flat
          </Text>
        ) : (
          <View>
            {residents.map((resident, index) => (
              <View key={resident.id} className={index > 0 ? "mt-3" : ""}>
                <TouchableOpacity
                  onPress={() => {
                    // TODO: Navigate to resident detail
                    Alert.alert("Resident", resident.name);
                  }}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 text-base">
                        {resident.name}
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        {resident.phone}
                      </Text>
                      {resident.email && (
                        <Text className="text-gray-500 text-sm mt-1">
                          {resident.email}
                        </Text>
                      )}
                    </View>
                    <View
                      className={`px-2 py-1 rounded ${
                        resident.type === "owner"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          resident.type === "owner"
                            ? "text-blue-700"
                            : "text-purple-700"
                        }`}
                      >
                        {resident.type === "owner" ? "Owner" : "Tenant"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Payments Section */}
      <View className="bg-white mx-4 rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">
            Payments ({payments.length})
          </Text>
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to add payment screen
              Alert.alert("Info", "Add payment functionality coming soon");
            }}
            className="bg-blue-600 px-3 py-1.5 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-semibold ml-1">Add</Text>
          </TouchableOpacity>
        </View>

        {payments.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">
            No payments recorded for this flat
          </Text>
        ) : (
          <View>
            {payments.slice(0, 5).map((payment, index) => (
              <View
                key={payment.id}
                className={`bg-gray-50 rounded-lg p-3 border border-gray-200 ${
                  index > 0 ? "mt-3" : ""
                }`}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {payment.type === "maintenance"
                        ? "Maintenance"
                        : "Payout"}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      {payment.month}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-gray-900 text-lg">
                      {formatCurrency(payment.amount)}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded mt-1 ${
                        payment.status === "paid"
                          ? "bg-green-100"
                          : payment.status === "overdue"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          payment.status === "paid"
                            ? "text-green-700"
                            : payment.status === "overdue"
                            ? "text-red-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                {payment.paidAt && (
                  <Text className="text-gray-500 text-xs mt-2">
                    Paid on {formatDate(payment.paidAt)}
                  </Text>
                )}
              </View>
            ))}
            {payments.length > 5 && (
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to full payments list
                  Alert.alert("Info", "View all payments coming soon");
                }}
                className="bg-blue-50 rounded-lg py-3 items-center mt-2"
              >
                <Text className="text-blue-600 font-semibold">
                  View All Payments ({payments.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="px-4 pb-6">
        <TouchableOpacity
          onPress={() => {
            // TODO: Navigate to edit flat screen
            Alert.alert("Info", "Edit flat functionality coming soon");
          }}
          className="bg-blue-600 rounded-lg py-4 items-center mb-3"
        >
          <Text className="text-white font-semibold text-lg">Edit Flat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
