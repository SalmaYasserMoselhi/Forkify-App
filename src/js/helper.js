import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // As soon as any promise of the race rejects or fulfills , the race will be settled
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${res.status}, ${data.message}`);

    return data;
  } catch (error) {
    // Propagating the error down from one async function to the other
    throw error;
  }
};
