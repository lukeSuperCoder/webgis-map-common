# vue-map-common

## 项目简介

本项目基于 Vue 2.x 框架，集成了多种主流地图技术的示例代码，包括 Mapbox、OpenLayer、AntvMap、SuperMap（超图）、Leaflet 等。项目同时提供了用户管理、角色管理、地图实例管理等后台管理功能，适合作为地图类项目的开发模板或学习参考。

## 主要功能

- **多种地图技术集成**：支持 Mapbox、OpenLayer、AntvMap、SuperMap、Leaflet 等主流地图框架的示例与二次开发。
- **后台管理功能**：内置用户管理、角色管理、地图实例管理等常用后台功能。
- **通用组件与工具**：封装了常用表格、树选择、菜单等组件及日期、校验、请求等工具函数。
- **完善的项目结构**：前后端分离，目录清晰，易于扩展和维护。

## 目录结构

```
|-- public/                  # 公共资源目录
|   |-- conf.js              # 通用配置
|   |-- favicon.ico
|   |-- index.html
|-- src/
|   |-- assets/              # 静态资源（图片、样式、字体等）
|   |-- components/          # 公共组件
|   |   |-- HelloWorld.vue
|   |   |-- NavMenu.vue
|   |   |-- SelectTree.vue
|   |   |-- BaseTable.vue
|   |-- plugins/             # 插件配置
|   |   |-- axios.js         # axios二次封装
|   |   |-- element.js       # element-ui按需引入
|   |-- router/              # 路由配置
|   |   |-- index.js
|   |-- store/               # Vuex状态管理
|   |   |-- index.js
|   |-- utils/               # 工具函数
|   |   |-- auth.js
|   |   |-- dateUtil.js
|   |   |-- rem.js
|   |   |-- request.js
|   |   |-- validate.js
|   |   |-- common.js
|   |-- views/               # 业务页面
|   |   |-- Home.vue
|   |   |-- About.vue
|   |   |-- common/
|   |   |   |-- 404.vue
|   |   |   |-- Login.vue
|   |   |-- SystemManagement/
|   |   |   |-- MapinstanceView.vue
|   |   |   |-- MapBoxTest.vue
|   |   |   |-- LeafletMap.vue
|   |   |   |-- OpenLayerTest.vue
|   |   |   |-- UserManagement.vue
|   |   |   |-- RoleManagement.vue
|   |   |   |-- SuperMapTest.vue
|   |   |   |-- MapTest.vue
|   |   |   |-- NewRoleInfo.vue
|   |   |   |-- NewUserInfo.vue
|   |   |   |-- AntvMap.vue
|   |-- App.vue
|   |-- main.js
|-- package.json             # 项目依赖及脚本
|-- vue.config.js            # Vue CLI 配置
|-- README.md                # 项目说明
```

## 主要依赖

- vue@2.x
- vue-router
- vuex
- element-ui
- mapbox-gl
- ol（OpenLayer）
- @antv/l7
- @supermap/iclient-ol
- leaflet
- 及相关地图扩展库、工具库等

## 安装与启动

1. 克隆本仓库到本地
   ```bash
   git clone https://github.com/lukeSuperCoder/webgis-map-common
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动开发环境
   ```bash
   npm run serve
   ```
4. 打包生产环境
   ```bash
   npm run build
   ```

## 使用说明

- 进入 `src/views/SystemManagement/` 目录，可查看各类地图技术的集成与示例页面。
- 用户和角色管理功能可在对应页面体验。
- 通用组件可在 `src/components/` 目录下复用或扩展。
- 工具函数可在 `src/utils/` 目录下查找和调用。

## 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

## 相关资源

- [Vue 官方文档](https://cn.vuejs.org/)
- [Mapbox 官方文档](https://docs.mapbox.com/)
- [OpenLayer 官方文档](https://openlayers.org/)
- [Antv 地图](https://antv.vision/zh)
- [SuperMap 超图](https://www.supermap.com/)
- [Element UI](https://element.eleme.cn/)
