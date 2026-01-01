import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Payment } from '@/types';

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    residentId: '1',
    flatId: '1',
    amount: 5000,
    type: 'maintenance',
    month: '2024-01',
    status: 'paid',
    paidAt: '2024-01-15',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
];

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'maintenance' | 'payout'>('all');
  const [newPayment, setNewPayment] = useState({
    residentId: '',
    flatId: '',
    amount: '',
    type: 'maintenance' as 'maintenance' | 'payout',
    month: '',
  });

  const handleAddPayment = () => {
    if (!newPayment.residentId || !newPayment.flatId || !newPayment.amount || !newPayment.month) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      residentId: newPayment.residentId,
      flatId: newPayment.flatId,
      amount: parseFloat(newPayment.amount),
      type: newPayment.type,
      month: newPayment.month,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPayments([...payments, payment]);
    setNewPayment({ residentId: '', flatId: '', amount: '', type: 'maintenance', month: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Payment record added successfully');
  };

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.type === filter);

  const totalMaintenance = payments
    .filter(p => p.type === 'maintenance' && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPayouts = payments
    .filter(p => p.type === 'payout' && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Payments</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Payment</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-white rounded-lg p-3">
              <Text className="text-sm text-gray-600">Maintenance</Text>
              <Text className="text-xl font-bold text-green-600">₹{totalMaintenance.toLocaleString()}</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-3">
              <Text className="text-sm text-gray-600">Payouts</Text>
              <Text className="text-xl font-bold text-blue-600">₹{totalPayouts.toLocaleString()}</Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <Text className={filter === 'all' ? 'text-white font-semibold' : 'text-gray-700'}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter('maintenance')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'maintenance' ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <Text className={filter === 'maintenance' ? 'text-white font-semibold' : 'text-gray-700'}>
                Maintenance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter('payout')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'payout' ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <Text className={filter === 'payout' ? 'text-white font-semibold' : 'text-gray-700'}>
                Payouts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredPayments.map((payment) => (
          <View
            key={payment.id}
            className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {payment.type === 'maintenance' ? 'Maintenance Payment' : 'Payout'}
                </Text>
                <Text className="text-sm text-gray-600">Flat: {payment.flatId} | {payment.month}</Text>
              </View>
              <View className={`px-3 py-1 rounded ${
                payment.status === 'paid' ? 'bg-green-100' :
                payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  payment.status === 'paid' ? 'text-green-700' :
                  payment.status === 'pending' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text className="text-xl font-bold text-gray-900">₹{payment.amount.toLocaleString()}</Text>
            {payment.paidAt && (
              <Text className="text-xs text-gray-500 mt-1">Paid on: {new Date(payment.paidAt).toLocaleDateString()}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Add Payment Record</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Type</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setNewPayment({ ...newPayment, type: 'maintenance' })}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    newPayment.type === 'maintenance'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <Text className={`font-semibold ${
                    newPayment.type === 'maintenance' ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    Maintenance
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNewPayment({ ...newPayment, type: 'payout' })}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    newPayment.type === 'payout'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <Text className={`font-semibold ${
                    newPayment.type === 'payout' ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    Payout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Resident ID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter resident ID"
                value={newPayment.residentId}
                onChangeText={(text) => setNewPayment({ ...newPayment, residentId: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter flat ID"
                value={newPayment.flatId}
                onChangeText={(text) => setNewPayment({ ...newPayment, flatId: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Amount</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter amount"
                value={newPayment.amount}
                onChangeText={(text) => setNewPayment({ ...newPayment, amount: text })}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Month (YYYY-MM)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="e.g., 2024-01"
                value={newPayment.month}
                onChangeText={(text) => setNewPayment({ ...newPayment, month: text })}
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
                onPress={handleAddPayment}
                className="flex-1 bg-purple-600 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Add Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

