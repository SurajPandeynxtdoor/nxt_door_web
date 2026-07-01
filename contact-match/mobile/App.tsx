import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CountryCode } from "libphonenumber-js";
import { api, AppConfig, PublicUser } from "./src/lib/api";
import { scanContacts } from "./src/lib/contacts";

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [me, setMe] = useState<PublicUser | null>(null);

  const [busy, setBusy] = useState(false);
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const [hashToName, setHashToName] = useState<Record<string, string>>({});

  const [friends, setFriends] = useState<PublicUser[] | null>(null);
  const [otherId, setOtherId] = useState("");
  const [mutual, setMutual] = useState<{ other: PublicUser; names: string[] } | null>(null);

  useEffect(() => {
    api
      .getConfig()
      .then(setConfig)
      .catch((e) => setConfigError(String(e)));
  }, []);

  const country = (config?.defaultCountry || "IN") as CountryCode;

  async function handleRegister() {
    if (!displayName.trim() || !phone.trim()) {
      Alert.alert("Missing info", "Enter your name and phone number.");
      return;
    }
    setBusy(true);
    try {
      const user = await api.register(displayName.trim(), phone.trim(), country);
      setMe(user);
    } catch (e) {
      Alert.alert("Registration failed", String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleScanAndUpload() {
    if (!me || !config) return;
    setBusy(true);
    try {
      const result = await scanContacts(config.pepper, country);
      if (!result) {
        Alert.alert("Permission needed", "Contacts permission was denied.");
        return;
      }
      await api.uploadContacts(me.id, result.hashes);
      setHashToName(result.hashToName);
      setUploadedCount(result.hashes.length);
      Alert.alert(
        "Contacts synced",
        `Hashed and uploaded ${result.hashes.length} numbers from ${result.matchedContacts} contacts.`
      );
    } catch (e) {
      Alert.alert("Sync failed", String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleFriendsOnApp() {
    if (!me) return;
    setBusy(true);
    try {
      const { friends } = await api.friendsOnApp(me.id);
      setFriends(friends);
    } catch (e) {
      Alert.alert("Lookup failed", String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleMutual() {
    if (!me || !otherId.trim()) {
      Alert.alert("Missing info", "Enter the other user's ID.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.mutual(me.id, otherId.trim());
      // Map the intersecting hashes back to names we hold locally.
      const names = res.mutualHashes.map((h) => hashToName[h] || "(in your contacts)");
      setMutual({ other: res.otherUser, names });
    } catch (e) {
      Alert.alert("Lookup failed", String(e));
    } finally {
      setBusy(false);
    }
  }

  if (configError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Cannot reach server.</Text>
        <Text style={styles.muted}>{configError}</Text>
        <Text style={styles.muted}>Check API_URL in src/lib/config.ts</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Connecting…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Contact Match</Text>
      <Text style={styles.subtitle}>
        Find people you both know — numbers are hashed on your device.
      </Text>

      {/* Step 1: register */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1 · Your profile</Text>
        {me ? (
          <View>
            <Text style={styles.label}>Signed in as {me.displayName}</Text>
            <Text style={styles.muted}>Your user ID (share to compare):</Text>
            <Text selectable style={styles.mono}>
              {me.id}
            </Text>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TextInput
              style={styles.input}
              placeholder="Your phone (e.g. +91 98765 43210)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <Button label="Register" onPress={handleRegister} disabled={busy} />
          </View>
        )}
      </View>

      {/* Step 2: contacts permission + sync */}
      {me && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2 · Sync contacts</Text>
          <Text style={styles.muted}>
            Grant permission to hash your contacts on-device and upload the hashes.
          </Text>
          <Button label="Grant permission & sync" onPress={handleScanAndUpload} disabled={busy} />
          {uploadedCount !== null && (
            <Text style={styles.label}>{uploadedCount} numbers synced.</Text>
          )}
        </View>
      )}

      {/* Use case #2 */}
      {me && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3 · Friends already on the app</Text>
          <Button label="Find my friends on the app" onPress={handleFriendsOnApp} disabled={busy} />
          {friends?.length === 0 && <Text style={styles.muted}>None of your contacts yet.</Text>}
          {friends?.map((f) => (
            <Text key={f.id} style={styles.label}>
              • {f.displayName}
            </Text>
          ))}
        </View>
      )}

      {/* Use case #1 */}
      {me && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>4 · Mutual numbers with another user</Text>
          <TextInput
            style={styles.input}
            placeholder="Other user's ID"
            autoCapitalize="none"
            value={otherId}
            onChangeText={setOtherId}
          />
          <Button label="Show mutual contacts" onPress={handleMutual} disabled={busy} />
          {mutual && (
            <View>
              <Text style={styles.label}>
                {mutual.names.length} number(s) in common with {mutual.other.displayName}:
              </Text>
              {mutual.names.map((n, i) => (
                <Text key={i} style={styles.muted}>
                  • {n}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {busy && <ActivityIndicator style={{ marginTop: 16 }} />}
      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

function Button({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 64, backgroundColor: "#f6f7f9" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 14, color: "#555", marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  label: { fontSize: 14, color: "#111", fontWeight: "500" },
  muted: { fontSize: 13, color: "#666" },
  mono: { fontFamily: "monospace", fontSize: 12, color: "#333", marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9db8f0" },
  buttonPressed: { backgroundColor: "#1d4ed8" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  error: { fontSize: 16, fontWeight: "600", color: "#b91c1c" },
});
