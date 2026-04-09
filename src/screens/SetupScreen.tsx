import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getInstanceUrl, saveInstanceUrl} from '../storage/config';
import type {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Setup'>;

export default function SetupScreen({navigation}: Props): React.JSX.Element {
  const [url, setUrl] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    getInstanceUrl().then(saved => {
      if (saved) {
        setUrl(saved);
      }
    });
  }, []);

  function normaliseUrl(raw: string): string {
    let u = raw.trim();
    if (u && !/^https?:\/\//i.test(u)) {
      u = 'https://' + u;
    }
    return u.replace(/\/$/, '');
  }

  async function handleSave() {
    const normalised = normaliseUrl(url);
    if (!normalised) {
      Alert.alert('URL required', 'Please enter the URL of your SimpleInvoices instance.');
      return;
    }
    await saveInstanceUrl(normalised);
    navigation.replace('WebView');
  }

  async function handleTest() {
    const normalised = normaliseUrl(url);
    if (!normalised) {
      Alert.alert('URL required', 'Enter a URL to test.');
      return;
    }
    setTesting(true);
    try {
      const res = await fetch(normalised, {method: 'HEAD'});
      Alert.alert(
        'Connection OK',
        `Server responded with status ${res.status}.`,
      );
    } catch {
      Alert.alert(
        'Connection failed',
        'Could not reach the server. Check the URL and your network connection.',
      );
    } finally {
      setTesting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>SimpleInvoices</Text>
        <Text style={styles.subtitle}>Connect to your instance</Text>

        <Text style={styles.label}>Instance URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://invoices.example.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleSave}>
          <Text style={styles.buttonTextPrimary}>Save &amp; Open</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleTest}
          disabled={testing}>
          {testing ? (
            <ActivityIndicator color="#2563eb" />
          ) : (
            <Text style={styles.buttonTextSecondary}>Test Connection</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Enter the full URL of your self-hosted SimpleInvoices installation.
          Your login is handled by the web app itself.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#f9fafb'},
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {backgroundColor: '#2563eb'},
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonTextPrimary: {color: '#fff', fontSize: 16, fontWeight: '600'},
  buttonTextSecondary: {color: '#2563eb', fontSize: 16, fontWeight: '600'},
  hint: {
    marginTop: 24,
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});
