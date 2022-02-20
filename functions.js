// Imports
import fetch from "node-fetch";
import { Headers } from "node-fetch";

// Helper functions
export async function fetchParsedDataFromAPI(url, meth, head) {
  let response = await fetch(url, {
    method: meth,
    headers: head,
  });
  return await response.json();
}

export function buildUrl(urlString, params) {
  let url = new URL(urlString);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return url;
}

export function buildHeader(object) {
  let header = new Headers();
  let keys = Object.keys(object);
  let values = Object.values(object);
  for (let i = 0; i < keys.length; i++) {
    header.append(keys[i], values[i]);
  }
  return header;
}
