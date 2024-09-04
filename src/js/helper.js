import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadedData = undefined) {
  try {
    const fetchData = uploadedData
      ? fetch(url, {
          method: 'POST', // Tell the api that I am sending data
          headers: {
            'Content-Type': 'application/json', // Tell the api that the data in the json format
          },
          body: JSON.stringify(uploadedData),
        })
      : fetch(url);

    // if there is uploadedData, after sending data to the api, it will also be returned back
    const res = await Promise.race([fetchData, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${res.status}, ${data.message}`);
    return data;
  } catch (error) {
    // Propagating the error down from one async function to the other
    throw error;
  }
};
