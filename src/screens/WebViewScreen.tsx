import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import type {WebViewNavigation} from 'react-native-webview';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getInstanceUrl} from '../storage/config';
import type {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

export default function WebViewScreen({navigation}: Props): React.JSX.Element {
  const webViewRef = useRef<WebView>(null);
  const [instanceUrl, setInstanceUrl] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getInstanceUrl().then(url => {
      if (!url) {
        navigation.replace('Setup');
      } else {
        setInstanceUrl(url);
      }
    });
  }, [navigation]);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack);
    },
    [],
  );

  const handleError = useCallback(() => {
    setLoadError(true);
    setLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setLoadError(false);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  const handleSettings = useCallback(() => {
    Alert.alert('Change instance', 'Go to setup to change your instance URL?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Settings', onPress: () => navigation.replace('Setup')},
    ]);
  }, [navigation]);

  if (!instanceUrl) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}>
          <Text style={[styles.navBtnText, !canGoBack && styles.disabled]}>
            {'‹'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.navTitle} numberOfLines={1}>
          SimpleInvoices
        </Text>

        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => {
              setLoadError(false);
              setLoading(true);
              webViewRef.current?.reload();
            }}>
            <Text style={styles.navBtnText}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleSettings}>
            <Text style={styles.navBtnText}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loadError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load SimpleInvoices.</Text>
          <Text style={styles.errorSub}>{instanceUrl}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettings} style={styles.settingsLink}>
            <Text style={styles.settingsLinkText}>Change instance URL</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{uri: instanceUrl}}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled={Platform.OS === 'ios'}
          thirdPartyCookiesEnabled
          allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => {
            setLoading(true);
            setLoadError(false);
          }}
          onLoadEnd={() => setLoading(false)}
          onError={handleError}
          onHttpError={handleError}
          renderLoading={() => (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          )}
          startInLoadingState
        />
      )}

      {loading && !loadError && (
        <View style={styles.loadingBar}>
          <View style={styles.loadingBarFill} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 8,
    paddingBottom: 8,
    backgroundColor: '#1e40af',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  navRight: {flexDirection: 'row'},
  navBtn: {padding: 8},
  navBtnText: {color: '#fff', fontSize: 22},
  disabled: {opacity: 0.3},
  webview: {flex: 1},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 98 : 50,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#bfdbfe',
  },
  loadingBarFill: {
    height: 2,
    width: '60%',
    backgroundColor: '#3b82f6',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSub: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  retryBtnText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  settingsLink: {padding: 8},
  settingsLinkText: {color: '#2563eb', fontSize: 14},
});
