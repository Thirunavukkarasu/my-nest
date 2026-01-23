import { FlatFormScreen } from "@/modules/flats";
import { Stack } from "expo-router";

export default function AddFlatModal() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          title: "Add New Flat",
          headerShown: true,
        }}
      />
      <FlatFormScreen actionType="new" />
    </>
  );
}
