import { IconSymbol } from "@/components/ui/icon-symbol";
import { AddLedgerEntryModal } from "@/modules/ledger/components/AddLedgerEntryModal";
import { useLedgerQuery, LedgerEntry } from "@/modules/ledger/hooks/useLedgerQuery";
import {
  LegendList,
  LegendListRenderItemProps,
} from "@legendapp/list";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LedgerScreen() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  // Fetch ledger entries using React Query
  const {
    data: entries = [],
    isLoading: loading,
    error,
  } = useLedgerQuery();

  const handleEntryAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["ledger"] });
  };

  const filteredEntries = useMemo(
    () =>
      filter === "all" ? entries : entries.filter((e) => e.entryType === filter),
    [entries, filter]
  );

  const totalCredits = entries
    .filter((e) => e.entryType === "credit")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalDebits = entries
    .filter((e) => e.entryType === "debit")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const balance = totalCredits - totalDebits;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", {
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Ledger</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-4">Loading ledger...</Text>
        </View>
      ) : (
        <>
        <LegendList
          data={filteredEntries}
          renderItem={({
            item: entry,
          }: LegendListRenderItemProps<LedgerEntry>) => (
            <View className="px-4 mb-3">
              <View className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {entry.description}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {formatDate(entry.transactionDate)}
                      {entry.flatId && ` | Flat: ${entry.flatId}`}
                      {entry.residentId && ` | Resident: ${entry.residentId}`}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded ${
                      entry.entryType === "credit"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        entry.entryType === "credit"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {entry.entryType.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text
                    className={`text-xl font-bold ${
                      entry.entryType === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {entry.entryType === "credit" ? "+" : "-"}
                    {formatCurrency(Number(entry.amount))}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Balance: {formatCurrency(entry.runningBalance)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(entry) => entry.ledgerId.toString()}
          ListHeaderComponent={
            <View className="px-4 pt-4 pb-2">
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-white rounded-lg p-3">
                  <Text className="text-sm text-gray-600">Total Credits</Text>
                  <Text className="text-xl font-bold text-green-600">
                    {formatCurrency(totalCredits)}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3">
                  <Text className="text-sm text-gray-600">Total Debits</Text>
                  <Text className="text-xl font-bold text-red-600">
                    {formatCurrency(totalDebits)}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3">
                  <Text className="text-sm text-gray-600">Balance</Text>
                  <Text
                    className={`text-xl font-bold ${
                      balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(balance)}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg ${
                    filter === "all" ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={
                      filter === "all"
                        ? "text-white font-semibold"
                        : "text-gray-700"
                    }
                  >
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilter("credit")}
                  className={`px-4 py-2 rounded-lg ${
                    filter === "credit" ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={
                      filter === "credit"
                        ? "text-white font-semibold"
                        : "text-gray-700"
                    }
                  >
                    Credits
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilter("debit")}
                  className={`px-4 py-2 rounded-lg ${
                    filter === "debit" ? "bg-red-600" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={
                      filter === "debit"
                        ? "text-white font-semibold"
                        : "text-gray-700"
                    }
                  >
                    Debits
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          recycleItems={true}
          maintainVisibleContentPosition
        />
        </>
      )}

      <AddLedgerEntryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleEntryAdded}
      />
    </SafeAreaView>
  );
}
