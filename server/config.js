import commonConfig from "../common/config.js";
import config from "./.config.js";

const defaultConfig = {
	...commonConfig,

	gitlabToken: "18ayouuEsKRo_yM1P5eF",

	secret: "keepwork",

	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "keepwork", // 数据库名
		username: "wuxiangan",
		password: "xxxxxx", 
	},

	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},


	gitlab: {
		token: "18ayouuEsKRo_yM1P5eF",
	},

	qiniu: {
		accessKey:"",
		secretKey:"",
	},
}

const productionConfig = {
	...defaultConfig,
	
	...config,
}

const developmentConfig = {
	...defaultConfig,

	...config,
}

const configs = {
	"production": productionConfig,
	"development": developmentConfig,
}

export default configs[process.env.NODE_ENV];