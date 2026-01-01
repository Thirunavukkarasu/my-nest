import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Resident, ResidentType } from '@/types';

// Mock data
const mockResidents: Resident[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    type: 'owner',
    flatId: '1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export default function ResidentsScreen() {
  const router = useRouter();
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'owner' as ResidentType,
    flatId: '',
  });

  const handleAddResident = () => {
    if (!newResident.name || !newResident.phone || !newResident.flatId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const resident: Resident = {
      id: Date.now().toString(),
      name: newResident.name,
      phone: newResident.phone,
      email: newResident.email || undefined,
      type: newResident.type,
      flatId: newResident.flatId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResidents([...residents, resident]);
    setNewResident({ name: '', phone: '', email: '', type: 'owner', flatId: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Resident added successfully');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Residents</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Resident</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <View className="flex-row gap-4 mb-2">
            <View className="flex-1 bg-white rounded-lg p-3">
              <Text className="text-sm text-gray-600">Total</Text>
              <Text className="text-2xl font-bold text-gray-900">{residents.length}</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-3">
              <Text className="text-sm text-gray-600">Owners</Text>
              <Text className="text-2xl font-bold text-green-600">
                {residents.filter(r => r.type === 'owner').length}
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-3">
              <Text className="text-sm text-gray-600">Tenants</Text>
              <Text className="text-2xl font-bold text-blue-600">
                {residents.filter(r => r.type === 'tenant').length}
              </Text>
            </View>
          </View>
        </View>

        {residents.map((resident) => (
          <View
            key={resident.id}
            className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">{resident.name}</Text>
                <Text className="text-sm text-gray-600">Flat: {resident.flatId}</Text>
              </View>
              <View className={`px-3 py-1 rounded ${
                resident.type === 'owner' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  resident.type === 'owner' ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {resident.type === 'owner' ? 'Owner' : 'Tenant'}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-600 mb-1">📞 {resident.phone}</Text>
            {resident.email && (
              <Text className="text-sm text-gray-600">✉️ {resident.email}</Text>
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
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <ScrollView>
              <Text className="text-2xl font-bold text-gray-900 mb-4">Add New Resident</Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Name *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter resident name"
                  value={newResident.name}
                  onChangeText={(text) => setNewResident({ ...newResident, name: text })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Phone *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter phone number"
                  value={newResident.phone}
                  onChangeText={(text) => setNewResident({ ...newResident, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter email (optional)"
                  value={newResident.email}
                  onChangeText={(text) => setNewResident({ ...newResident, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Type *</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setNewResident({ ...newResident, type: 'owner' })}
                    className={`flex-1 rounded-lg py-3 items-center border-2 ${
                      newResident.type === 'owner'
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      newResident.type === 'owner' ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      Owner
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setNewResident({ ...newResident, type: 'tenant' })}
                    className={`flex-1 rounded-lg py-3 items-center border-2 ${
                      newResident.type === 'tenant'
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      newResident.type === 'tenant' ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      Tenant
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter flat ID"
                  value={newResident.flatId}
                  onChangeText={(text) => setNewResident({ ...newResident, flatId: text })}
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
                  onPress={handleAddResident}
                  className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">Add Resident</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

