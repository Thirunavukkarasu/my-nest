import { FlatFormScreen, useFlatDetailQuery } from "@/modules/flats";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function EditFlatModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useFlatDetailQuery(id);

  if (isLoading || !data) {
    return (
      <>
        <Stack.Screen
          options={{
            presentation: "modal",
            title: "Edit Flat",
            headerShown: true,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          title: "Edit Flat",
          headerShown: true,
        }}
      />
      <FlatFormScreen actionType="edit" flat={data.flat} />
    </>
  );
}
