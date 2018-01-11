# ucenter

> fywl ucenter project

## Build Setup

``` bash

##启动连接本地开发环境
"dev": "node build/dev-server.js",
"start": "cross-env NODE_ENV=development IS_PROD=false npm run dev",

##启动连接预演环境
"start:preview": "cross-env NODE_ENV=preview IS_PROD=false npm run dev",

##启动连接测试环境
"start:fytest": "cross-env NODE_ENV=fytest IS_PROD=false npm run dev",

##编译生产环境
"build": "cross-env NODE_ENV=production IS_PROD=true node build/build.js",

#编译测试可改API地址环境
`"build:prod": "cross-env NODE_ENV=prod IS_PROD=true node build/build.js",`

##编译预演环境
"build:preview": "cross-env NODE_ENV=preview IS_PROD=true node build/build.js",

##编译测试环境
"build:fytest": "cross-env NODE_ENV=fytest IS_PROD=true  node build/build.js",

```
