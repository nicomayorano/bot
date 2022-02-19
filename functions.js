const fetch = import('node-fetch');
const { Headers } = import('node-fetch')

module.exports = {
	async fetchParsedDataFromAPI(url, meth, head) {
		let response = await fetch(url, {
			method: meth,
			headers: head
		});
		return response.json();
	},

	buildUrl(urlString, params) {
		let url = new URL(urlString);
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		return url;
	},

	buildHeader(...args) {
		let header = new Headers();
		for (let [key, value] of args) {
			header.append(key, value);
		}
		return header;
	}
}