import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useStore } from "./lib/store";

export default function Home() {
  const router = useRouter();
  const { usageCount, isPro, incUsage } = useStore();

  const handleGenerate = async () => {
    // client-side gate: free users get 3 total generations
    if (!isPro && usageCount >= 3) {
      router.push("/paywall");
      return;
    }

    await incUsage();
    router.push("/plan");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home - MuhsinAI</Text>
      <Text>Usage: {usageCount}</Text>
      <Text>Pro: {isPro ? "yes" : "no"}</Text>
      <Button title="Generate Plan" onPress={handleGenerate} />
      <Button title="Paywall" onPress={() => router.push("/paywall")} />
    </View>
  );
}
