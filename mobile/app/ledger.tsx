import { IconSymbol } from "@/components/ui/icon-symbol";
import { apiClient } from "@/lib/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LedgerEntry {
  ledgerId: number;
  flatId: number | null;
  residentId: number | null;
  entryType: "credit" | "debit";
  amount: number;
  description: string;
  transactionDate: string;
  runningBalance: number;
  createdAt: string;
  updatedAt: string;
}

export default function LedgerScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [newEntry, setNewEntry] = useState({
    flatId: "",
    residentId: "",
    entryType: "credit" as "credit" | "debit",
    amount: "",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLedger({
        page: 1,
        limit: 100,
        sortCriterias: [{ columnName: "transactionDate", columnOrder: "desc" }],
      });

      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }

      if (response.data?.data) {
        setEntries(response.data.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load ledger entries");
      console.error("Error loading ledger:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (
      !newEntry.amount ||
      !newEntry.description ||
      !newEntry.transactionDate
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const entryData = {
        flatId: newEntry.flatId ? parseInt(newEntry.flatId) : null,
        residentId: newEntry.residentId ? parseInt(newEntry.residentId) : null,
        entryType: newEntry.entryType,
        amount: parseFloat(newEntry.amount),
        description: newEntry.description,
        transactionDate: newEntry.transactionDate,
      };

      const response = await apiClient.createLedgerEntry(entryData);

      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }

      Alert.alert("Success", "Ledger entry added successfully");
      setNewEntry({
        flatId: "",
        residentId: "",
        entryType: "credit",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
      loadLedger();
    } catch (error) {
      Alert.alert("Error", "Failed to add ledger entry");
      console.error("Error adding ledger entry:", error);
    }
  };

  const filteredEntries =
    filter === "all" ? entries : entries.filter((e) => e.entryType === filter);

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
    <View className="flex-1 bg-gray-50">
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

      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-600 mt-4">Loading ledger...</Text>
          </View>
        ) : (
          <>
            <View className="mb-4">
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

            {filteredEntries.map((entry) => (
              <View
                key={entry.ledgerId}
                className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
              >
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
            ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Add Ledger Entry
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Type
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() =>
                    setNewEntry({ ...newEntry, entryType: "credit" })
                  }
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    newEntry.entryType === "credit"
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      newEntry.entryType === "credit"
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    Credit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setNewEntry({ ...newEntry, entryType: "debit" })
                  }
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    newEntry.entryType === "debit"
                      ? "bg-red-50 border-red-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      newEntry.entryType === "debit"
                        ? "text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    Debit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Description *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter description"
                value={newEntry.description}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, description: text })
                }
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Amount *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter amount"
                value={newEntry.amount}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, amount: text })
                }
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Transaction Date *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="YYYY-MM-DD"
                value={newEntry.transactionDate}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, transactionDate: text })
                }
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Flat ID (optional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter flat ID"
                value={newEntry.flatId}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, flatId: text })
                }
                keyboardType="number-pad"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Resident ID (optional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter resident ID"
                value={newEntry.residentId}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, residentId: text })
                }
                keyboardType="number-pad"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddEntry}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Add Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
