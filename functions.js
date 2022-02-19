// Imports
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';

// Helper functions
export async function fetchParsedDataFromAPI(url, meth, head) {
	let response = await fetch(url, {
		method: meth,
		headers: head
	});
	return response.json();
}

export function	buildUrl(urlString, params) {
	let url = new URL(urlString);
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	return url;
}

export function	buildHeader(...args) {
	let header = new Headers();
	for (let [key, value] of args) {
		header.append(key, value);
	}
	return header;
}