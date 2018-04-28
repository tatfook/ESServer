## ESServer 部署
> nuxt-vue-koa2 项目  
> client vue框架客户端根目录  
> server koa2框架服务端根目录

1. git clone git@github.com:tatfook/ESServer.git  # 或 git clone git@github.com:wxaxiaoyao/note.git
2. npm install 
3. cd projectDir/common; vim .config.js   # projectDir 项目目录 修改相关配置如下
```
const defaultConfig = {
	# ... 其它配置项

	# server host port
	host: "0.0.0.0",
	port: 7654,

	# keepwork接口地址
	keepwork: {
		baseURL: "http://stage.keepwork.com/api/wiki/models/",
		# keepwork代理接口地址(主要对qiniu底层接口作部分代理
		proxyBaseURL: "http://stage.keepwork.com/api/wiki/models/",
	},

	# ES 搜索代理服务接口地址  目前为前端直接访问ES 可忽略
	ESService: {
		baseURL: "http://47.52.20.34:7654/api/v0/",
	},
	
	# ES 服务接口地址(原生ES服务)
	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},
}
```
4. cd projectDir/server; cp config.js .config.js; vim .config.js  # 修改服务端相关认证配置
```
const defaultConfig = {
	# ... 其它配置项
	
	# keepork JWT TOKEN
	secret: "keepwork",

	# gitlab 管理员访问token  存在拉取任意用户文件操作
	gitlab: {
		token: "xxxxx",
	},
	
	# qiniu 相关配置
	qiniu: {
		accessKey:"",
		secretKey:"",
		bucketName: "keepwork-dev",
		bucketDomian: "http://oy41aju0m.bkt.clouddn.com",
	},
}
5. npm run build; npm run start  # 编译启动server
6. demo 示例
	- http://xxxxx.com/note/demo/login    # 进行登录
	- http://xxxxx.com/note/demo          # 登录后自行跳转至此  此页面展示表数据列表  
	- http://xxxxx.com/note/demo/new      # 新增表记录页面  图片上传为七牛上传
```
