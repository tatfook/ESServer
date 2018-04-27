import _ from "lodash";

import commonConfig from "../common/config.js";
import config from "./.config.js";

const defaultConfig = {
	secret: "keepwork",

	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "keepwork", // 数据库名
		username: "wuxiangan",
		password: "", 
	},

	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},


	gitlab: {
		token: "",
	},

	qiniu: {
		accessKey:"",
		secretKey:"",
	},
}

const productionConfig = {
}

const developmentConfig = {
}

const localConfig = {

}

const configs = {
	"local": _.merge(commonConfig, defaultConfig, localConfig, config),
	"production": _.merge(commonConfig, defaultConfig, productionConfig, config),
	"development": _.merge(commonConfig, defaultConfig, developmentConfig, config),
}

console.log(process.env.ENV);

export default configs[process.env.ENV];
