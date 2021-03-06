## 								webpack4学习 --进阶篇	

### 前言

​	[参考文章](https://juejin.im/post/5dc01199f265da4d12067ebe)。在次感谢此文作者，此文打通了我对webpack源码主流程的仁都二脉。笔者也一直想写一篇webpack主流程相关以及loader和plugin内部运行机制的文章。

​	读本文前，假设你已经研究过webpack核心功能 -- tapable

​	if ( 搞懂了 tapable !== true ) {

​			return 请先研读 [《显微镜下的webpack4：灵魂tapable，终于搞懂钩子系列！》](https://juejin.im/post/5be90b84e51d457c1c4df852)	

​	}

ok，到此，你已经有一定基础来梳理webpack主流程。

下面贴出来的代码可能和源码有些出入，经过删选过的，具体可以参照源码。



### 编写入口文件

​	编写一个简单启动webpack 的文件 debug.js

```javascript
//载入webpack主体
let webpack=require('webpack');
//指定webpack配置文件
let config=require('./build/webpack.prod.js');
//执行webpack，返回一个compile的对象，这个时候编译并未执行
let compile=webpack(config);
//运行compile，执行编译
compile.run();
```

### 初始化

假设你已经有了webpack源码，找到webpack项目下的package.json文件。

发现:

```javascript
  // package.json
  "main": "./lib/webpack.js",
  
  // ./lib/webpack.js
  exports = module.exports = webpack;
```

所以, let webpack = require('webpack')，其实就是这个函数

```javascript
const webpack = (options, callback) => {
	
	// 代码块1：
	const webpackOptionsValidationErrors = validateSchema(
		webpackOptionsSchema,
		options
	);
	if (webpackOptionsValidationErrors.length) {
		throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
	}
	// 代码块1 end---------------
	
	let compiler;
	if (typeof options === "object") {
		options = new WebpackOptionsDefaulter().process(options);

		compiler = new Compiler(options.context);
		compiler.options = options;
		
		new NodeEnvironmentPlugin({
			infrastructureLogging: options.infrastructureLogging
		}).apply(compiler);
		
		// 代码块2
		if (options.plugins && Array.isArray(options.plugins)) {
			for (const plugin of options.plugins) {
				if (typeof plugin === "function") {
					plugin.call(compiler, compiler);
				} else {
					plugin.apply(compiler);
				}
			}
		}
		// 2 end---------
		
		compiler.hooks.environment.call();
		compiler.hooks.afterEnvironment.call();
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}
	return compiler;
};
```

- 其中，一个好的系统都会做参数校验，代码块1，就是对传进来的options做判断。

- options = new WebpackOptionsDefaulter().process(options); webpack4能做到0配置是因为它。

  这一句，设置了webpack的许多默认属性，具体在WebpackOptionsDefaulter.js文件中，并且继承了OptionsDefaulter类。

  看完就明白了 entry为什么默认是 ./src下，cache只有在development下打开，optimization下splitChunks的默认分割文件规则等等。

  以后要是不明白webpack4的默认行为，常来这里看看。

- compiler = new Compiler(options.context);  然后实例化了一个Complier(继承了Tapable)实例，为编译做准备。其中在complier对象上定义了hook属性，里面包含了各种钩子。

  ```
  this.hooks = {
  			done: new AsyncSeriesHook(["stats"]),
  			beforeRun: new AsyncSeriesHook(["compiler"]),
  			run: new AsyncSeriesHook(["compiler"]),
  			emit: new AsyncSeriesHook(["compilation"]),
  			assetEmitted: new AsyncSeriesHook(["file", "content"]),
  			afterEmit: new AsyncSeriesHook(["compilation"]),
  
  			compilation: new SyncHook(["compilation", "params"]),
  			normalModuleFactory: new SyncHook(["normalModuleFactory"]),
  			contextModuleFactory: new SyncHook(["contextModulefactory"]),
  			beforeCompile: new AsyncSeriesHook(["params"]),
  			compile: new SyncHook(["params"]),
  			make: new AsyncParallelHook(["compilation"]),
  			afterCompile: new AsyncSeriesHook(["compilation"]),
  			
  			// TODO the following hooks are weirdly located here
  			// TODO move them for webpack 5
  			environment: new SyncHook([]),
  			afterEnvironment: new SyncHook([]),
  			afterPlugins: new SyncHook(["compiler"]),
  			afterResolvers: new SyncHook(["compiler"]),
  			entryOption: new SyncBailHook(["context", "entry"])
  		};
  ```

   所以如果写插件，想在哪个阶段做事情，就和这个有关了。

- compiler.options = options; 并把默认的参数挂载到了complier实例。

- NodeEnvironmentPlugin插件, 在文件中 NodeEnvironmentPlugin.js提供了node.js 的fs 操作文件的能力，同时注册了beforeRun钩子的监听函数，功能是在运行前清理文件缓存。

- 代码块2的功能是，调用在webpack.config.js 配置文件中传入的各个插件实例的apply 方法，并把编译实例complier作为参数传进去了。所以暴露了webpack合并的默认参数和各阶段的钩子函数，供君使用。到这里，最简单的插件产生了。

  ```javascript
  
  class HookTest {
      constructor() {
          console.log('HookTest被实例化.....');
      }
      apply(compiler) {
          console.log('apply方法被调用');
          //compiler.hooks.run.tap('testHook', (compiler, err) => {
          //    console.log('beforeRun 执行完了，到run了', compiler, err);
          //});
      }
  }
  
  module.exports = HookTest;
  ```

  

- compiler.hooks.environment.call();/compiler.hooks.afterEnvironment.call(); 触发这2个钩子函数

- compiler.options = new WebpackOptionsApply().process(options, compiler); 这句就吊了。你们知道得webpack 一切皆插件。但是！我们的配置怎么转化为具体功能的呢？就是这句代码的作用，它把所有的配置转化成对应的插件并apply，即在对应阶段tap/tapAsync(监听)了事件，供之后call/callAsync/promise(调用)。意思是你的配置都转化成了功能，调用不调用它都在那里等你call。

  

  到这初始化结束，总结下初始化做了哪些事情。

  1. 初始化了配置参数options
  2. 初始化了编译Complier 实例对象complier，并定义了各种阶段钩子。并将options挂载在了complier上
  3. complier上增加了文件操作能力
  4. 注册webpack.config.js 中传入的plugins
  5. 配置参数转化为插件，注册相应功能

### 编译

​		我们从上面知道，编译是从complier.run()开始，但是，真正编译的工作是在 Compilation类里面完成的, Complier却是作为一个主流程触发一系列钩子。看下我总结的一个流程：

<img src="/Users/apple/Downloads/webpack 流程图.jpg" alt="webpack 流程图" style="zoom: 50%;" />	

从图中可以看到具体流程。

- addEntry 表示添加入口文件
- _addModuleChain 添加模块链
- runLoaders 获取对应的loader解析文件
- Seal 触发各种钩子，Chunk的优化打包构建
- onCompiled 完成了最后输出文件到磁盘的操作

编译模块的主要过程，参考这篇[文章](https://juejin.im/post/5d418879f265da03af19b03f#heading-10) 说得很详细了没错就是抄来抄去得。你懂就好了。

所以loader 的解析我们就知道了是在runLoaders这个阶段。

