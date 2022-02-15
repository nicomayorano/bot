const fetch = require('node-fetch');
const {Headers} = require('node-fetch');

const fetchParsedDataFromAPI = async (url, meth, head) => {
	let response = await fetch(url, {
		method: meth,
		headers: head
	});
	return response.json();
};

const buildUrl = (urlString, params) => {
	let url = new URL(urlString);
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	return url;
}

const buildHeader = (...args) => {
	let header = new Headers();
	for (let [key, value] of args) {
		header.append(key, value);
	}
	return header;
}