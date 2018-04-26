import _ from "lodash";
import joi from "joi";
import wurl from "wurl";
import yaml from "js-yaml";
import elasticsearch from "elasticsearch";
import ERR from "../common/error.js";
import config from "../config.js";
import {Key, getKeyByPath} from "../../common/api/common.js";
import {gitlabFactory} from "../../common/api/gitlab.js";
import gitlab from "../../common/api/gitlab.js";

const esClient = new elasticsearch.Client({
	host:config.elasticsearch.baseURL,
})

// 获取GIT的ES数据
const getGitData = async function(git, path) {
	try {
		const content = await git.getContent(path);
		const data = JSON.parse(content);
		return data;
	} catch (e){
		console.log(e);
	}
	return;
} 

const formatSiteinfoESData = function(data) {

}

const formatUserinfoESData = function(data) {

}

const formatPageinfoESData = function(data) {

}

const formatESDataMap = {
	"userinfo": formatUserinfoESData,
	"siteinfo": formatSiteinfoESData,
	"pageinfo": formatPageinfoESData,
}

export const Gitlab = function() {
	
}

// 获取git文件中的数据信息
Gitlab.prototype.getGitFileData = function(content) {
	try {
		//return Json.parse(content);
		return yaml.safeLoad(content, {json:true});
	} catch(e) {
		console.log(e);
	}

	return ;
}

Gitlab.prototype.formatESData = function(data, tablename) {
	data = _.cloneDeep(data || {});
	const format = formatESDataMap[tablename];

	format && format(data);

	return data;
}

Gitlab.prototype.submitESData = async function(item) {
	const data = item.data || {};
	const action = item.action;
	const path = item.path;
	const key = item.key;
	if (!key){
		console.log("无效数据");
		return;
	}

	const table = key.getTable();
	const esData = {
		index: table.index(),
		type: table.type(),
		id: key.uid(),
		body: data.data || {},
	}
	esData.body.path = key.path();

	let res = null;
	try {
		console.log(item, esData);
		res = await (esClient[action])(esData);
	} catch(e) {
		console.log(e);
	}
	//console.log(res);
}

Gitlab.prototype.webhook = async function(ctx) {
	const self = this;
	const params = ctx.request.body;
	const project_url = params.project.http_url;
	const origin = wurl("protocol", project_url) + "://" + wurl("hostname", project_url);
	const gitcfg = {
		rawBaseUrl:origin,
		project_id:params.project_id,
		external_username: params.user_username,
		token:config.gitlab.token,
	}
	const git = gitlabFactory(gitcfg);
	
	// 取出文件列表
	const filelist = [];
	const dataFileReg = /^__data__\/.+\.yaml$/;
	const filelistAddItem = (path, oper, action) => {
		if (!dataFileReg.test(path)) return;
		const key = getKeyByPath(path);

		key && filelist.push({
			key:key,
			path:path, 
			oper:oper,
			action:action,
		});
	}

	_.each(params.commits, commit => {
		_.each(commit.added, (path) => filelistAddItem(path, "added", "index"));
		_.each(commit.modified, (path) => filelistAddItem(path, "modified", "index"));
		_.each(commit.removed, (path) => filelistAddItem(path, "removed", "delete"));
	});

	const promises = [];
	_.each(filelist, (item) => {
		if (item.action != "delete") {
			promises.push(git.getContent(item.path).then(content => {
				item.content = content;
				item.data = self.getGitFileData(content) || {};
			}));
		}
	});

	await Promise.all(promises);

	//console.log(filelist);
	_.each(filelist, file => self.submitESData(file));

	return ;
}

// 提供接口 写git es
Gitlab.prototype.gitlab = async (ctx) => {
	const params = ctx.request.body;

	if (!params.git || !params.git.projectId || !params.path || !params.data) return ERR.ERR_PARAMS;

	const gitcfg = params.git;
	gitcfg.token = gitcfg.token || config.gitlabToken;
	const git = gitlabFactory(gitcfg);

	git.upsertFile();
}

Gitlab.prototype.getRoutes = function() {
	const prefix = "gitlab";
	const routes = [
	{
		path: prefix + "/webhook",
		method: "post",
		action: "webhook",
	},
	];

	return routes;
}

export default new Gitlab();
