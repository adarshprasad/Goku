import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

const KEY = "huduku_shop_url";
const DEFAULT_URL = "http://192.168.29.238:3000";

function normalize(raw) {
  const u = raw.trim().replace(/\/$/, "");
  if (!u) return DEFAULT_URL;
  if (!/^https?:\/\//i.test(u)) return `https://${u}`;
  return u;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [setup, setSetup] = useState(true);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [draft, setDraft] = useState(DEFAULT_URL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      const next = saved || DEFAULT_URL;
      setUrl(next);
      setDraft(next);
      setSetup(!saved);
      setReady(true);
    });
  }, []);

  const save = useCallback(async () => {
    const next = normalize(draft);
    await AsyncStorage.setItem(KEY, next);
    setUrl(next);
    setDraft(next);
    setSetup(false);
    setLoading(true);
  }, [draft]);

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#c4a574" />
      </View>
    );
  }

  if (setup) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.setup}>
          <Text style={styles.brand}>Huduku</Text>
          <Text style={styles.tag}>Open your shop</Text>
          <Text style={styles.hint}>
            Same Wi‑Fi as the Fedora box: http://192.168.29.238:3000{"\n"}
            Off Wi‑Fi: paste your https://….trycloudflare.com link
          </Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder={DEFAULT_URL}
            placeholderTextColor="#8a7a6a"
            style={styles.input}
          />
          <Pressable onPress={save} style={styles.btn}>
            <Text style={styles.btnText}>Open shop</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.bar}>
        <Text style={styles.brandSmall}>Huduku</Text>
        <Pressable onPress={() => setSetup(true)} hitSlop={12}>
          <Text style={styles.change}>Change URL</Text>
        </Pressable>
      </View>
      <WebView
        source={{ uri: url }}
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
  center: { flex: 1, backgroundColor: "#6b1d2a", justifyContent: "center" },
  setup: { padding: 24, gap: 12 },
  brand: { color: "#f7f1e8", fontSize: 32, fontWeight: "600" },
  brandSmall: { color: "#f7f1e8", fontSize: 18, fontWeight: "600" },
  tag: { color: "#c4a574", fontSize: 16 },
  hint: { color: "#efe6d6", fontSize: 13, lineHeight: 20, marginVertical: 8 },
  input: {
    minHeight: 48,
    backgroundColor: "#f7f1e8",
    color: "#1c1412",
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  btn: { backgroundColor: "#c4a574", minHeight: 48, justifyContent: "center", alignItems: "center" },
  btnText: { color: "#4a1018", fontWeight: "700" },
  bar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  change: { color: "#c4a574", fontSize: 13 },
  web: { flex: 1, backgroundColor: "#f7f1e8" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    top: 48,
  },
});
