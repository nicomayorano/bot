/* eslint-disable import/no-duplicates */
// Imports
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';

// Helper functions
export async function fetchParsedDataFromAPI(url, meth, head) {
  const response = await fetch(url, {
    method: meth,
    headers: head,
  });
  return response.json();
}

export function buildUrl(urlString, params) {
  const url = new URL(urlString);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  return url;
}

export function buildHeader(object) {
  const header = new Headers();
  const keys = Object.keys(object);
  const values = Object.values(object);
  for (let i = 0; i < keys.length; i += 1) {
    header.append(keys[i], values[i]);
  }
  return header;
}
