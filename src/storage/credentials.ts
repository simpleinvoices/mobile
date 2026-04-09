import * as Keychain from 'react-native-keychain';

const SERVICE = 'SimpleInvoices';

export async function saveCredentials(
  username: string,
  password: string,
): Promise<void> {
  await Keychain.setGenericPassword(username, password, {service: SERVICE});
}

export async function getCredentials(): Promise<{
  username: string;
  password: string;
} | null> {
  const result = await Keychain.getGenericPassword({service: SERVICE});
  if (!result) {
    return null;
  }
  return {username: result.username, password: result.password};
}

export async function clearCredentials(): Promise<void> {
  await Keychain.resetGenericPassword({service: SERVICE});
}
