## 								webpack4 学习-基础篇					

webpack是现在前端最火的打包工具，我相信很多小伙伴想学好webpack，这里的学好可能是能熟练配置webpack，在实际工作中能够去配置和优化自己的项目，也可能是想知道webackp运行的原理，从而能扩展自己项目功能。不管是哪种，可能和我一样，看过许多webpack相关的文章，但是到自己写配置的时候又不知道从何下手。因此我这篇文章的目的，一是梳理webpack相关的基础知识，另外就是加深自己对webpack的理解。

回到正文

###webpack的核心概念



#### Entry:

- entry: 入口起点，指示webpack应该使用哪个模块，作为构建内部依赖图的开始。递归解析所有依赖项，生成依赖关系图。
	
	用法： `entry: string|Array<string>`
	
	
	
	##### webpack.config.js
```javascript
module.exports = {
	entry: {
		app: './src/app.js' // 入口地址
	}
}
//简写形式
module.exports = {
  entry: './src/app.js'
}
```

具体配置详见[官网](https://www.webpackjs.com/concepts/entry-points/#%E5%8D%95%E4%B8%AA%E5%85%A5%E5%8F%A3-%E7%AE%80%E5%86%99-%E8%AF%AD%E6%B3%95)



#### Output:

- output: 定义webpack编译文件的输出目录。注意，即使入口文件有多个，但是输出文件只有一个。同时，也可以根据名字输出多文件。
	
	用法： 

webpack.config.js
```javascript
module.exports = {
	output: {
		filename: 'bundle.js', //输出文件名称 [name].js
		path: path.resolve(__dirname, 'dist'), //文件输出目录的绝对路径
    publicPath: '/'
	}
}	
```

publicPath为webpack 打包的静态资源的基础路径。[详细见官网](https://www.webpackjs.com/guides/public-path/#%E7%A4%BA%E4%BE%8B)

当设置了publicPath以后，静态资源路径为： 域名 + publicPath + filename;

代码配置：

<img src="/Users/apple/Library/Application Support/typora-user-images/image-20200428234515787.png" alt="image-20200428234515787" style="zoom: 50%;" />

浏览器显示:

<img src="/Users/apple/Library/Application Support/typora-user-images/image-20200428234813000.png" alt="image-20200428234813000" style="zoom:50%;" />



其中output.path，是打包后文件存放位置，而output.publicPath是html 引入静态资源前缀路径（当文件不是放在网站根目录的时候需要配置）。

同时在开发模式下，devServer下有一个publicPath配置。我们知道，devServer是一个node.js 服务，它会把生成的文件放在内存，这样会提升打包速度，因此devServer.publicPath 代表文件在内存中的路径，与output.path 倒是有几分相同的意思。如图配置：

代码配置:

​	<img src="/Users/apple/Library/Application Support/typora-user-images/image-20200429000245681.png" alt="image-20200429000245681" style="zoom:40%;" />

浏览器：

<img src="/Users/apple/Library/Application Support/typora-user-images/image-20200429000548344.png" alt="image-20200429000548344" style="zoom:60%;" />

当deveServer.PublicPath = '/testPath' 时候，在浏览器里可以通过 localhost:8080/testPath/bundle.js 访问



#### Mode:


- mode: webpack4新增的属性，对应模式开启了对应的插件。详见 [这里] (https://www.webpackjs.com/concepts/mode/)



#### Loader:


- loader: 有些文档说loader可以让webpack 处理非javascript文件，比如，css文件，图片文件等。但是loader不止这些功能。官方文档说的好，loader 是用于对模块的源代码进行转换。loader能获取到文件源码，对其任意修改，并返回结果，同时可以给下个loader处理。

  ------

  下面列出常见的loader: 

  (默认 install 下列对应的loader情况下)

  

  1. ​	raw-loader: 能够加载原始文件内容	

  配置：

  ```javascript
  module.exports = {
  	entry: '',
  	output: {},
  	module: {
  	rules: [
  		{
  			test: /\.txt/,
  			uset: 'raw-loader'
  		}
  	]
  }
  ```
  
  使用:

  ```javascript
    import txt from './rawTxtTest.txt';
    console.log(txt) // 打印出rawTxtTest文件内容
  
  ```
  

webpack通过 raw-loader解析出txt文件内容。

  2. file-loader: 能够处理图片资源文件

配置:
```javascript
	module.exports = {
	entry: '',
	output: {},
	module: {
	rules: [
		{
      test: /\.(jpg|png|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }]
     }
	]
}
```

使用:
```
	import img from './a.jpg';
	console.log(img); // /src/a.jpg
```

File-loader会在对应目录下生产文件。当不配置name时，会生成hash值的文件。

  3. url-loader: 处理图片资源文件
配置:
```javascript
	module.exports = {
	entry: '',
	output: {},
	module: {
	rules: [
		{
      test: /\.(jpg|png|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
        	limit: 1000000 
        }
      }]
     }
	]
}
```
url-loader与file-loader功能类似，不同的是当使用url-loader，文件小于limit(btye)大小时,返回一个DataUrl(data:开头的base64数据)

  4. source-map-loader: 加载源文件额外的source map文件，便宜断点调试
  5. svg-inline-loader: 解析svg
  7. json-loader/json5-loader: webpack4默认支持解析json文件，json5-loader可以解析json5文件
  8. babel-loader: 解析es6+语法为es5
	配置:
```
				module.exports = {
          entry: '',
          output: {},
          module: {
          rules: [
            {
              test: /\.js$/,
              use: [{
              	loader: 'babel-loader',
              	options: { // 此部分内容可以放在 .babelrc配置文件中
                   presets: [ ["@babel/preset-env", {
                   		targets: {
                   			"chrome": '51',
                   			ie: '9'
                   		},
                   		modules: false,
                   		useBuiltIns: 'entry',
                   		corejs: 2
                   }]],
                   plugins: [
                   		'@babel/plugin-syntax-dynamic-import',
                   		'@babel/plugin-transform-runtime'
                   ]
                	}
              }] 
            	incluede: [path.resolve(__dirname, 'src')]
            }
          ]
        }
```
options配置告诉babel该如何解析js文件，其中：
presets 为预设，最常见的预设为 @babel/preset-env，它能根据配置的目标环境(target)把es6解析成es5。
babel是一块大的内容，包括它的安装使用配置原理，这里不详细介绍，会有单独的文章描述babel。

8. eslint-loader: 能够通过配置的规则检测js语法

  配置:
```
		module.exports = {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: [{
              loader: 'eslint-loader' // eslint会根据.eslintrc.js文件做代码检测，同时也可以放在rules属于里
              rules: {}
            }],
            include: path.resolve(__dirname, './src/**/*.js'),
            exclude: /node_modules/ 
          }
        ]
      }
		}
		
		// .eslintrc.js
		module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"], // 继承所有规则
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
          },
    },
    plugins: ['react'],
    "rules": { //修改配置具体规则
        "react/display-name": 0,
        "no-unused-vars": [2, {"vars": "all", "args": "after-used"}],
        "no-console": "off",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
```
可以通过package.josn文件中 设置"pre-commit"来统一提交代码风格。

9. ts-loader: typescript解析成javascript语法，解析.ts文件

10. awesome-typescript-loader: 与ts-loader功能相同，性能优于ts-loader

11. sass/less-loader: sass/less语法解析成css。解析 sass/less文件

12. postcss-loader: 自动补全css3前缀

13. css-loader: 加载css，使其模块化

14. style-loader: 注册css到html中

15. vue-loader: 解析.vue文件

```
	// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

//vue 官网写法
const VueLoaderPlugin = require('vue-loader/lib/plugin')
	module.exports = {
  	entry: '',
  	output: {},
  	module: {
  	rules: [
  		{
      	test: /\.vue$/,
      	use: 'vue-loader'
      }
  	],
  	plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new VueLoaderPlugin()
    ]
  }
  
  // main.js
import Vue from 'vue';
import App from './App.vue';

new Vue({
	el: '#app',
	render: h => h(App)
})

// app.vue
<template>
    <div class='c'>
        测试内容
        {{this.name}}
    </div>
</template>
<script>
//import Home from './Home.vue'
export default {
    //components: {
    //    Home
    //},
    data(){
        return {
            name: 'panhe'
        }
    }
}
</script>

<style lang="less" scoped>
    @color: blue;
    .c {
        color: @color;
    }
</style>
```

16. @babel/preset-react: 解析react
```
	// .babelrc
	{
    "presets": [["@babel/preset-env", {
            "targets": {
                "browsers": ["last 2 versions"],
                "ie": 7
            }
        }],
        "@babel/react"
    ],
    "plugins": ["@babel/transform-runtime"]
}

// 另外在babel-loader 加上jsx文件解析，就完成了所有配置
```

#### Loader原理：

loader运行原理和手写loader将在《webpack学习 - 进阶篇》中

#### Plugin：

​	Plugin用于扩展webpack功能。plugins属性中为一个数组，接受各种Plugin实例。

```
	modules.export = {
    plugins: [
          new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'index.html'
          }),
          new VueLoaderPlugin()
      ]
	}
```



webpack 有着丰富的插件接口(rich plugin interface)。webpack 自身的多数功能都使用这个插件接口。这个插件接口使 webpack 变得**极其灵活**。  --- webpack 官网

列出常用的Plugins(笔者会敲一遍加深印象，为之后的plugin原理和手写plugin做好铺垫):

1. HtmlWebpackPlugin

   作用：生成html文件，并把webpack打包后的静态资源注入到生成的html文件里。

```
	new HtmlWebpackPlugin({
  	filename: 'index.html', //输出文件名称
  	template: 'index.html', // 模板文件位置
		title: '标题'， // 生成文件标题
		inject: true|body|head|false, //js插入文件位置 body底部|body底部|heade底部|不生成js文件
		favicon: '', //生成favicon
		hash: true, // bundle.js?172f055e3f49af92a993 形式引入js到html中
		minify: { // 对生成的html进行压缩
			collapseWhitespace: true, // 去掉空格，默认false
			removeComments: true, // 去掉注释默认false
			removeEmptyAttributes: true, // 删除空属性
			//删除style的类型属性， type="text/css" 
    	removeStyleLinkTypeAttributes: true,
    	//删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false
    	removeScriptTypeAttributes: true,
    	useShortDoctype: true, // 短文档类型
		}
}),
```
2. webpack-bundle-analyzer
	作用：清晰看到各个bundle的构成，可按需分割优化。
	
	<img src="/Users/apple/Library/Application Support/typora-user-images/image-20200501143049739.png" alt="image-20200501143049739" style="zoom: 25%;" />
	
```
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	plugins: [
   new BundleAnalyzerPlugin(),
  ]
```
默认配置已经满足要求，具体配置可以看[这里](https://www.npmjs.com/package/webpack-bundle-analyzer)

3. DefinePlugin

   作用： 用于定义全局变量，用来区分开发和生成环境。传入DefinePlugin构造函数的键值对，在项目任何地方可以被引用。

```
	new webpack.DefinePlugin({
  	PRODUCTION: JSON.stringify(true),
  	VERSION: JSON.stringify("5fa3b9"),
  	BROWSER_SUPPORTS_HTML5: true,
  	TWO: "1+1",
  	"typeof window": JSON.stringify("object")
})
```
注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')。 -- webpack 官网

4. DllPlugin/DllReferencePlugin
	这个插件用的好会提升我们build的速度。这就是它的作用。接下来看下怎么使用，其实很简单，按照格式来，剩下你只需要修改下你的公共打包依赖和文件输出位置即可，其他固定不变基本满足要求。
	准备一个 webpack.dll.config.js。用来输出dll文件
```
// webpack.dll.config.js
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
module.exports = {
    entry: {
        react: ['react', 'react-dom']
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../static'),
        library: '_dll_[name]'
    },
    plugins: [
        new DllPlugin({
            name: '_dll_[name]',
            path: path.join(__dirname, 'dist', '[name].manifest.json')
        })
    ]
}

// package.json
script: {
	+ 'dll': 'webpack --config build/webpack.dll.config.js'
}
```
唯一要求，output.library === dllPlugin.name (dllPlugin为Dllplugin 实例)
上面配置意思： 将react, react-dom 这个2个固定不变的依赖打包到了dll文件中，以后build只要在dll寻找。另外一个文件是DllPlugin 输出的manifest.json文件，提供给兄弟插件DllReferencePlugin使用，告诉它怎么去找静态资源。
在webpack.config.js文件使用

```
	// 动态链接库
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
plugins: [
        new DllReferencePlugin({
            manifest: require('./dist/react.manifest.json')
        })
    ]
```
执行npm run dll后， 再执行npm run build

5. UglifyjsWebpackPlugin
```
// webpack.config.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyJsPlugin()
  ]
}
```
具体配置见[官网](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/)
6. SplitChunkPlugin
从webpack v4开始，CommonsChunkPlugin删除了，而改为optimization.splitChunks。
有时候做了按需加载，打包出来以后的文件还是会很大，是因为spiltChunks规则导致，此时就需要重新设置splitChunks规则。如果想牺牲服务器压力追求用户体验的效果就可以划分许多规则。

默认配置：
```
	optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          test: /(react|react-dom)/,
          priority: -10,
          name: '打包出来的文件名称'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
```
主要是splitChunks.cacheGroups属性，其中每一个key都将是一个划分规则，将以此打包出一个chunk文件。cacheGroups以外的属性可以继承。

chunks: all|async|inital 所有文件|异步文件|同步文件
test：匹配文件规则
priority：规则优先级，越大的先处理
maxAsyncRequests，maxInitialRequests 同步/异步最大请求数也会影响打包出来的结果。

详细规则可以参考[这里](https://www.cnblogs.com/kwzm/p/10314438.html)，系列文章我觉得写得非常清晰。	

7. MinCssExtractPlugin

   此插件是将css样式提取到单独的文件中。

#### resovle
resovle模块能够根据自己的需求更改规则去寻找文件
- alias
	别名寻找文件
```
	resolve{
		alias: {
			@: './src/components'
		}
	}
	这样就可以根据 import '@'寻找'./src/components'的文件
```



- mainFields
	mainFields可以设置采用哪一份代码
	
	
	
- extensions
	自动补上后缀名。extensions: ['.ts', '.js', 'json']。
	import './data' 就会去找 ts，js, json 格式，没找到则报错。
	
	
	
- modules

  当我们引入第三方模块的时候，webpack默认会去node_modules中寻找，但是有些模块频繁使用的时候我们可以用modules进行设置.

  比如, import '../src/components/button' 会在许多地方用到，则可以设置 modules: ['./src/components', 'node_modules'] ，在项目中只需要 import 'button'即可

  

- enforceExtension/enforceModuleExtension

  设置enforceExtension: true时，当import './data'会报错，必须加上后缀.js或者其他

  enforceModuleExtension则是针对node_modules 的第三方模块

  

 

