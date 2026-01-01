import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Complaint } from '@/types';

// Mock data
const mockComplaints: Complaint[] = [
  {
    id: '1',
    residentId: '1',
    flatId: '1',
    title: 'Noise Complaint',
    description: 'Loud music from neighbor',
    status: 'open',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

export default function ComplaintsScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'closed'>('all');
  const [newComplaint, setNewComplaint] = useState({
    residentId: '',
    flatId: '',
    title: '',
    description: '',
  });

  const handleAddComplaint = () => {
    if (!newComplaint.residentId || !newComplaint.flatId || !newComplaint.title || !newComplaint.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const complaint: Complaint = {
      id: Date.now().toString(),
      residentId: newComplaint.residentId,
      flatId: newComplaint.flatId,
      title: newComplaint.title,
      description: newComplaint.description,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComplaints([...complaints, complaint]);
    setNewComplaint({ residentId: '', flatId: '', title: '', description: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Complaint submitted successfully');
  };

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Complaints</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">New Complaint</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <View className="flex-row gap-2 flex-wrap">
            {(['all', 'open', 'resolved', 'closed'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${
                  filter === status ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <Text className={filter === status ? 'text-white font-semibold' : 'text-gray-700'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredComplaints.map((complaint) => (
          <View
            key={complaint.id}
            className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">{complaint.title}</Text>
                <Text className="text-sm text-gray-600">Flat: {complaint.flatId}</Text>
              </View>
              <View className={`px-3 py-1 rounded ${
                complaint.status === 'resolved' ? 'bg-green-100' :
                complaint.status === 'closed' ? 'bg-gray-100' : 'bg-red-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  complaint.status === 'resolved' ? 'text-green-700' :
                  complaint.status === 'closed' ? 'text-gray-700' : 'text-red-700'
                }`}>
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-700 mb-3">{complaint.description}</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-gray-500">
                Created: {new Date(complaint.createdAt).toLocaleDateString()}
              </Text>
              {complaint.resolvedAt && (
                <Text className="text-xs text-gray-500">
                  Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
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
              <Text className="text-2xl font-bold text-gray-900 mb-4">Submit Complaint</Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Resident ID</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter resident ID"
                  value={newComplaint.residentId}
                  onChangeText={(text) => setNewComplaint({ ...newComplaint, residentId: text })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter flat ID"
                  value={newComplaint.flatId}
                  onChangeText={(text) => setNewComplaint({ ...newComplaint, flatId: text })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Title</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter complaint title"
                  value={newComplaint.title}
                  onChangeText={(text) => setNewComplaint({ ...newComplaint, title: text })}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Describe your complaint"
                  value={newComplaint.description}
                  onChangeText={(text) => setNewComplaint({ ...newComplaint, description: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
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
                  onPress={handleAddComplaint}
                  className="flex-1 bg-red-600 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

