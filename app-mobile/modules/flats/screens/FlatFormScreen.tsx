import { Flat } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useRouter } from "expo-router";
import { z } from "zod";
import { useCreateFlat, useUpdateFlat } from "../hooks/useFlatMutations";

// Zod schemas for flat form validation
const flatFormSchemaNew = z.object({
  floorNumber: z.string().min(1, "Floor number is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  owner: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
  }),
});

const flatFormSchemaEdit = z.object({
  floorNumber: z.string().min(1, "Floor number is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  owner: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
});

type FlatFormDataNew = z.infer<typeof flatFormSchemaNew>;
type FlatFormDataEdit = z.infer<typeof flatFormSchemaEdit>;
type FlatFormData = FlatFormDataNew | FlatFormDataEdit;

interface FlatFormScreenProps {
  actionType: "new" | "edit";
  flat?: Flat | null; // Required for edit mode
}

export function FlatFormScreen({ actionType, flat }: FlatFormScreenProps) {
  const router = useRouter();
  const createFlatMutation = useCreateFlat();
  const updateFlatMutation = useUpdateFlat(flat?.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlatFormData>({
    resolver: zodResolver(
      actionType === "new" ? flatFormSchemaNew : flatFormSchemaEdit
    ),
    defaultValues: {
      floorNumber: "",
      flatNumber: "",
      owner: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
    },
  });

  // Reset form when component mounts or flat changes
  useEffect(() => {
    if (actionType === "edit" && flat) {
      reset({
        floorNumber: flat.floor.toString(),
        flatNumber: flat.flatNumber,
        owner: {
          firstName: "", // Edit modal doesn't show owner fields
          lastName: "",
          email: "",
          phone: "",
        },
      });
    } else {
      reset({
        floorNumber: "",
        flatNumber: "",
        owner: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
      });
    }
  }, [actionType, flat, reset]);

  const onSubmit = (data: FlatFormData) => {
    if (actionType === "new") {
      const newData = data as FlatFormDataNew;
      if (!newData.owner.firstName || !newData.owner.lastName) {
        return;
      }
      createFlatMutation.mutate(
        {
          floorNumber: parseInt(newData.floorNumber),
          flatNumber: newData.flatNumber,
          owner: {
            firstName: newData.owner.firstName,
            lastName: newData.owner.lastName,
            email: newData.owner.email || undefined,
            phone: newData.owner.phone || undefined,
          },
        },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
    } else if (actionType === "edit" && flat) {
      const editData = data as FlatFormDataEdit;
      updateFlatMutation.mutate(
        {
          flatId: parseInt(flat.id),
          flatNumber: editData.flatNumber,
          floorNumber: parseInt(editData.floorNumber),
        },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
    }
  };

  const isLoading = createFlatMutation.isPending || updateFlatMutation.isPending;
  const title = actionType === "new" ? "Add New Flat" : "Edit Flat";

  return (
    <View className="flex-1 bg-white">
      <KeyboardAwareScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
      >
        <Text className="text-2xl font-bold text-gray-900 mb-4">{title}</Text>

        {actionType === "new" && (
          <Text className="text-sm text-gray-600 mb-4">Flat Information</Text>
        )}

        {/* Floor Number */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Floor Number *
          </Text>
          <Controller
            control={control}
            name="floorNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter floor number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  editable={!isLoading}
                />
                {errors.floorNumber && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.floorNumber.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Flat Number */}
        <View className={actionType === "new" ? "mb-6" : "mb-4"}>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Flat Number *
          </Text>
          <Controller
            control={control}
            name="flatNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="e.g., 101, 102"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isLoading}
                />
                {errors.flatNumber && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.flatNumber.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Owner Information - Only for new flats */}
        {actionType === "new" && (
          <View className="border-t border-gray-200 pt-4 mt-2">
            <Text className="text-sm text-gray-600 mb-4">
              Owner Information (Required)
            </Text>

            {/* Owner First Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Owner First Name *
              </Text>
              <Controller
                control={control}
                name="owner.firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                      placeholder="Enter owner first name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                    />
                    {errors.owner?.firstName && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.owner.firstName.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Owner Last Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Owner Last Name *
              </Text>
              <Controller
                control={control}
                name="owner.lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                      placeholder="Enter owner last name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                    />
                    {errors.owner?.lastName && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.owner.lastName.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Owner Email */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Owner Email (Optional)
              </Text>
              <Controller
                control={control}
                name="owner.email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                      placeholder="Enter owner email"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    {errors.owner?.email && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.owner.email.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Owner Phone */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Owner Phone (Optional)
              </Text>
              <Controller
                control={control}
                name="owner.phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                      placeholder="Enter owner phone"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      editable={!isLoading}
                    />
                    {errors.owner?.phone && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.owner.phone.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
            disabled={isLoading}
          >
            <Text className="text-gray-900 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-semibold">
                {actionType === "new" ? "Add Flat" : "Save"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
