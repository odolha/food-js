let _secrets = null;

export const loadSecret = async (secretKey) => {
  if (!_secrets) {
    try {
      _secrets = (await import('./../secrets/secrets.mjs')).default;
    } catch (e) {
      console.warn('Secrets not allowed here, configs will not contain sensitive values');
      _secrets = {};
    }
  }
  return _secrets[secretKey];
};
