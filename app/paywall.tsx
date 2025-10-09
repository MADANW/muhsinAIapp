import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useStore } from "./lib/store";

export default function Paywall() {
  const { setPro } = useStore();
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Paywall</Text>
      <Button
        title="Simulate Purchase (set Pro)"
        onPress={() => {
          setPro(true);
          router.back();
        }}
      />
    </View>
  );
}
