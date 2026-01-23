import { VehicleFormScreen } from "@/modules/vehicles";
import { Stack } from "expo-router";

export default function AddVehicleModal() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          title: "Add New Vehicle",
          headerShown: true,
        }}
      />
      <VehicleFormScreen />
    </>
  );
}
