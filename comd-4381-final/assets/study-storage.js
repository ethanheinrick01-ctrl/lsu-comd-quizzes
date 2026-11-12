/* Lossless, offline storage adapter. Existing keys, JSON exports and schemas stay intact.
   lz-string@1.5.0 is vendored alongside this file; no network or paid service is used. */
(function (root) {
  'use strict';
  var PREFIX = 'study-lz16-v1:';
  var script = root.document && root.document.currentScript;
  var compactKeys = script && script.getAttribute ? (script.getAttribute('data-storage-keys') || '').split(/\s+/).filter(Boolean) : [];
  function compact(skip) {
    compactKeys.forEach(function (key) {
      if (key === skip) return;
      try {
        var raw = root.localStorage.getItem(key);
        if (!raw || raw.indexOf(PREFIX) === 0) return;
        var encoded = PREFIX + root.LZString.compressToUTF16(raw);
        if (encoded.length < raw.length && decode(encoded) === raw) root.localStorage.setItem(key, encoded);
      } catch (_) { /* retain the original record; the live write reports failure */ }
    });
  }
  function decode(raw) {
    if (raw === null || raw.indexOf(PREFIX) !== 0) return raw;
    var value = root.LZString.decompressFromUTF16(raw.slice(PREFIX.length));
    if (value === null || value === '') throw new Error('Saved progress could not be decompressed. Original bytes are retained.');
    return value;
  }
  var failed = {};
  function status(key, error, quiet) {
    if (quiet) return;
    if (error) failed[key] = true; else delete failed[key];
    if (!root.document || !root.document.body || !root.document.createElement) return;
    var node = root.document.getElementById('study-storage-status');
    if (!node) {
      node = root.document.createElement('div'); node.id = 'study-storage-status'; node.setAttribute('role', 'alert');
      node.style.cssText = 'margin:12px auto;padding:16px;max-width:1180px;border:2px solid #e8ad63;border-radius:12px;background:#251c12;color:#fff2df';
      root.document.body.prepend(node);
    }
    node.hidden = !Object.keys(failed).length;
    node.textContent = node.hidden ? '' : 'Progress could not be saved. Keep this tab open and download a progress backup before refreshing. Browser storage may be full or blocked.';
  }
  function getItem(key) { return decode(root.localStorage.getItem(key)); }
  function writeItem(key, value) {
    value = String(value);
    var previous = root.localStorage.getItem(key), encoded = value;
    if (previous && previous.indexOf(PREFIX) === 0) encoded = PREFIX + root.LZString.compressToUTF16(value);
    try { root.localStorage.setItem(key, encoded); }
    catch (e) {
      if (!(e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014)) throw e;
      if (encoded === value) encoded = PREFIX + root.LZString.compressToUTF16(value);
      // Do not replace a record unless the complete original string round-trips.
      if (encoded.length >= value.length || decode(encoded) !== value) throw e;
      try { root.localStorage.setItem(key, encoded); }
      catch (retry) {
        if (!(retry.name === 'QuotaExceededError' || retry.code === 22 || retry.code === 1014)) throw retry;
        // A brand-new activity may need space held by another record in this
        // same course. Compact only explicitly configured, compatible keys.
        compact(key); root.localStorage.setItem(key, encoded);
      }
    }
  }
  function setItem(key, value, quiet) {
    try { writeItem(key, value); status(key, null, quiet); }
    catch (e) { status(key, e, quiet); throw e; }
  }
  root.StudyStorage = { getItem: getItem, setItem: setItem,
    configure: function (keys) { compactKeys = keys.slice(); },
    removeItem: function (key) { root.localStorage.removeItem(key); }, decode: decode };
})(typeof window !== 'undefined' ? window : globalThis);
