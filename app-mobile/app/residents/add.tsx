import { ResidentFormScreen } from "@/modules/residents";
import { Stack } from "expo-router";

export default function AddResidentModal() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          title: "Add New Resident",
          headerShown: true,
        }}
      />
      <ResidentFormScreen />
    </>
  );
}
