import { LedgerEntryFormScreen } from "@/modules/ledger";
import { Stack } from "expo-router";

export default function AddLedgerEntryModal() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          title: "Add Ledger Entry",
          headerShown: true,
        }}
      />
      <LedgerEntryFormScreen />
    </>
  );
}
