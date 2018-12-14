const ONE_DAY = 1000 * 60 * 60 * 24;

export default class Cache {
  constructor(expirationDelayMs) {
    this.expirationDelayMs = expirationDelayMs || ONE_DAY;
  }

  get(key) {
    const cache = window.localStorage.getItem(key);

    if (cache) {
      const data = JSON.parse(cache);
      if (data.expires >= Date.now()) {
        return data.value;
      }
    }

    return null;
  }

  set(key, value) {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        value,
        expires: Date.now() + this.expirationDelayMs
      })
    );
  }

  remove(key) {
    window.localStorage.removeItem(key);
  }
}
