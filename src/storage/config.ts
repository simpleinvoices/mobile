import AsyncStorage from '@react-native-async-storage/async-storage';

const INSTANCE_URL_KEY = 'si_instance_url';

export async function saveInstanceUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(INSTANCE_URL_KEY, url.trim());
}

export async function getInstanceUrl(): Promise<string | null> {
  return AsyncStorage.getItem(INSTANCE_URL_KEY);
}

export async function clearInstanceUrl(): Promise<void> {
  await AsyncStorage.removeItem(INSTANCE_URL_KEY);
}
