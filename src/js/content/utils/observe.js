export default function observe(el, callback, options = { childList: true }) {
  if (typeof el === "string") {
    el = document.querySelector(el);
  }

  if (!el) {
    return;
  }

  const observer = new MutationObserver(callback);
  observer.observe(el, options);

  // Run the first time
  callback.call(observer, []);

  return observer;
}
