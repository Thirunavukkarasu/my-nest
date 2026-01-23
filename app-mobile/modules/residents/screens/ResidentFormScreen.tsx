import { ResidentType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useCreateResident } from "../hooks/useResidentMutations";

const getRelationLabel = (relation: string) => {
  switch (relation) {
    case "self": return "Self";
    case "spouse": return "Spouse";
    case "child": return "Child";
    case "parent": return "Parent";
    case "sibling": return "Sibling";
    case "other": return "Other";
    default: return "";
  }
};

export function ResidentFormScreen() {
  const router = useRouter();
  const { flatId } = useLocalSearchParams<{ flatId?: string }>();
  const createResidentMutation = useCreateResident(flatId);
  const [formData, setFormData] = useState({
    flatId: flatId || "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    relation: "self" as "self" | "spouse" | "child" | "parent" | "sibling" | "other",
    residentType: "owner" as ResidentType,
    leaseStartDate: new Date().toISOString().split("T")[0],
    isPrimaryTenant: true,
  });

  useEffect(() => {
    setFormData({
      flatId: flatId || "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      relation: "self",
      residentType: "owner",
      leaseStartDate: new Date().toISOString().split("T")[0],
      isPrimaryTenant: true,
    });
  }, [flatId]);

  const handleSubmit = () => {
    const finalFlatId = flatId || formData.flatId;
    if (!formData.firstName || !formData.lastName || !formData.phone || !finalFlatId) {
      return;
    }

    const flatIdNum = parseInt(finalFlatId);
    if (isNaN(flatIdNum)) {
      return;
    }

    createResidentMutation.mutate(
      {
        flatId: flatIdNum,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        relation: formData.relation,
        residentType: formData.residentType,
        leaseStartDate: formData.leaseStartDate,
        isPrimaryTenant: formData.isPrimaryTenant,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAwareScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <Text className="text-2xl font-bold text-gray-900 mb-4">Add New Resident</Text>

        {!flatId && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
              placeholder="Enter flat ID"
              value={formData.flatId}
              onChangeText={(text) => setFormData({ ...formData, flatId: text })}
              keyboardType="number-pad"
              editable={!createResidentMutation.isPending}
            />
          </View>
        )}

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">First Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="Enter first name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            editable={!createResidentMutation.isPending}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Last Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="Enter last name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            editable={!createResidentMutation.isPending}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Phone *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            editable={!createResidentMutation.isPending}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="Enter email (optional)"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!createResidentMutation.isPending}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Date of Birth</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirth}
            onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
            editable={!createResidentMutation.isPending}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Relation</Text>
          <View className="flex-row gap-2 flex-wrap">
            {(["self", "spouse", "child", "parent", "sibling", "other"] as const).map((rel) => (
              <TouchableOpacity
                key={rel}
                onPress={() => setFormData({ ...formData, relation: rel })}
                className={`px-3 py-2 rounded-lg border-2 ${
                  formData.relation === rel
                    ? "bg-green-50 border-green-500"
                    : "bg-gray-50 border-gray-300"
                }`}
                disabled={createResidentMutation.isPending}
              >
                <Text
                  className={`text-sm font-medium ${
                    formData.relation === rel ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {getRelationLabel(rel)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Type *</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() =>
                setFormData({ ...formData, residentType: "owner", isPrimaryTenant: true })
              }
              className={`flex-1 rounded-lg py-3 items-center border-2 ${
                formData.residentType === "owner"
                  ? "bg-green-50 border-green-500"
                  : "bg-gray-50 border-gray-300"
              }`}
              disabled={createResidentMutation.isPending}
            >
              <Text
                className={`font-semibold ${
                  formData.residentType === "owner" ? "text-green-700" : "text-gray-600"
                }`}
              >
                Owner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setFormData({ ...formData, residentType: "tenant", isPrimaryTenant: false })
              }
              className={`flex-1 rounded-lg py-3 items-center border-2 ${
                formData.residentType === "tenant"
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-50 border-gray-300"
              }`}
              disabled={createResidentMutation.isPending}
            >
              <Text
                className={`font-semibold ${
                  formData.residentType === "tenant" ? "text-blue-700" : "text-gray-600"
                }`}
              >
                Tenant
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Lease Start Date *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            placeholder="YYYY-MM-DD"
            value={formData.leaseStartDate}
            onChangeText={(text) => setFormData({ ...formData, leaseStartDate: text })}
            editable={!createResidentMutation.isPending}
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
            disabled={createResidentMutation.isPending}
          >
            <Text className="text-gray-900 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 bg-green-600 rounded-lg py-3 items-center"
            disabled={createResidentMutation.isPending}
          >
            {createResidentMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-semibold">Add Resident</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
