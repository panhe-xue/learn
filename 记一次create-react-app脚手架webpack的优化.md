# 			记一次create-react-app脚手架webpack的优化

#### 背景

​	公司的项目历史比较悠久，其中react-scripts版本写死在1.1.4，所以npm run eject以后，会发现内部webpack还是 3.x版本的。

​	公司目前项目结构比较特殊，有一个home-web 作为项目骨架，7大板块和其他项目都是当作依赖安装在home-web内部，暴露其需要展示的组件，在骨架中引入使用，类似作为第三方框架使用。

​	这样就带来了一个严重的问题，home-web 骨架项目在build以后的体积非常巨大，并且build的时间非常的久，可能需要你开一盘王者的时间才能完成。这是非常不能忍受的事情。但就是这样，于是我开始着手干这件事情

​	注意一件事情： 本来单独的项目使用了webpack build以后放到了npm仓库，但是在home-web build的时候会再次去打包编译这些项目。我觉得这些完全是没有必要的；

#### react-app-rewired

​	优化项目webpack前，必须获取到项目webpack配置权限。这里有2种获取webpack权限的方法，一种是npm run eject暴露CRA项目的配置文件，具体下文会讲到。另外一种就是使用react-app-rewired工具重写项目内部工具。

作用：

​	此工具能在不eject并且不创建额外的react-scripts情况下修改CRA内部的webpack配置文件，能够根据你的需要修改或者重写webpack的pulgins 和 loaders

用法：

1, 安装react-app-rewired

对于 create-react-app 1.x 或 react-scripts-ts 与 Webpack 3：

```javascript
$ npm install react-app-rewired@1.6.2 --save-dev
```



2，在根目录创建 config-override.js 文件

```javascript
/* config-overrides.js */
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return config;
}
```

3，增加运行命令

```javascript
  /* package.json */

  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
}
```

当运行npm run start 或者 npm run build 的时候config-override.js 的配置就会重写或者修改 CRA 项目内部的webpack 配置

具体配置方法详见 

[此处]: https://www.npmjs.com/package/react-app-rewired



#### npm run eject

​	获取修改CRA的webpack配置的能力的另一种方法就是用eject

#### 打包速度优化

##### loader优化

##### plugin优化

#### 打包体积优化

##### loader优化

##### plugin优化

#### 待优化

#### 总结

