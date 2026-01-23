import { FlatDetailScreen } from "@/modules/flats";
import { useLocalSearchParams } from "expo-router";

export default function FlatDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FlatDetailScreen flatId={id || ""} />;
}
