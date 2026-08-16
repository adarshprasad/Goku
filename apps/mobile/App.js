import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const SITE =
  process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://192.168.29.238:3000";

export default function App() {
  const [loading, setLoading] = useState(true);
  const uri = useMemo(() => SITE, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.bar}>
        <Text style={styles.brand}>Huduku</Text>
        <Text style={styles.tag}>Hennige anda seere inda</Text>
      </View>
      <WebView
        source={{ uri }}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        style={styles.web}
      />
      {loading ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#c4a574" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#6b1d2a" },
  bar: { paddingHorizontal: 16, paddingVertical: 10 },
  brand: { color: "#f7f1e8", fontSize: 22, fontWeight: "600" },
  tag: { color: "#c4a574", fontSize: 12, marginTop: 2 },
  web: { flex: 1, backgroundColor: "#f7f1e8" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    top: 56,
  },
});
