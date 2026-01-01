import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  color: string;
}

function FeatureCard({ title, description, icon, onPress, color }: FeatureCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className={`w-12 h-12 rounded-lg ${color} items-center justify-center mr-4`}>
          <IconSymbol name={icon} size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">{title}</Text>
          <Text className="text-sm text-gray-600">{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      title: 'Flats',
      description: 'Manage 40 flats across 5 floors',
      icon: 'building.2.fill',
      route: '/flats',
      color: 'bg-blue-500',
    },
    {
      title: 'Residents',
      description: 'Add and manage owners & tenants',
      icon: 'person.2.fill',
      route: '/residents',
      color: 'bg-green-500',
    },
    {
      title: 'Payments',
      description: 'Track maintenance payments & payouts',
      icon: 'creditcard.fill',
      route: '/payments',
      color: 'bg-purple-500',
    },
    {
      title: 'Complaints',
      description: 'Handle resident complaints',
      icon: 'exclamationmark.triangle.fill',
      route: '/complaints',
      color: 'bg-red-500',
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">RR Enclave</Text>
          <Text className="text-base text-gray-600">Apartment Management Dashboard</Text>
        </View>

        <View className="mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm text-gray-600 mb-1">Total Flats</Text>
                <Text className="text-3xl font-bold text-gray-900">40</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-600 mb-1">Floors</Text>
                <Text className="text-3xl font-bold text-gray-900">5</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-xl font-semibold text-gray-900 mb-3">Features</Text>
        </View>

        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            color={feature.color}
            onPress={() => router.push(feature.route as any)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
