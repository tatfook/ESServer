import elasticsearch from "elasticsearch";

import config from "../config.js";

const esClient = new elasticsearch.Client({
	host: "http://10.28.18.7:9200",
});


const ElasticSearch = function() {

}

ElasticSearch.prototype.search = async function(ctx) {
	const params = ctx.request.body;

	const data = await esClient.search(params).catch((e) => {console.log(e)});
	console.log(data, params);

	return data;
}

ElasticSearch.prototype.getRoutes = function() {
	const prefix = "elasticsearch";
	const routes = [
	{
		path: prefix + "/search",
		method: "post",
		action: "search",
	},
	];

	return routes;
}

export default new ElasticSearch();
