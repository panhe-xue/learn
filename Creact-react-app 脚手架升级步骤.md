## Creact-react-app 脚手架升级步骤



### 1 删除node_modules



### 2 升级 react-scripts到 3.4.1 (2020-06-17最新)

### 	

### 3 yarn install

### 	

### 4 升级相关依赖

```
yarn add babel-eslint@10.1.0 babel-jest@24.9.0 babel-loader@8.1.0  eslint@6.6.0  jest@24.9.0 react-app-rewired -D

yarn add customize-cra react-app-rewired –D
```

### 	

### 5 修改config-overrides.js(示例)

```js
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer')

const path = require('path')
const theme = require('./theme')

const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addPostcssPlugins
} = require('customize-cra')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const addCustomize = () => config => {
  config.externals = {
    'moment': 'moment',
    "react": 'React',
    "react-dom": 'ReactDOM',
    'immutable': 'Immutable',
    'babel-polyfill': 'window',
    "mathjs": 'math',
    "lodash": "_"
  }
  const env = config.mode
  if (env === 'production') {
    config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: 'static',
      reportFilename: 'report.html'
    })
  }
  return config
}

module.exports = override(
  addLessLoader({
    // ident: 'postcss', // 注释后 FIXED: TypeError: options.plugins.push is not a function
    javascriptEnabled: true,
    modifyVars: theme
  }),
  addCustomize(),
  
  // antb-mobile按需引入
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es',
    style: 'css'
  }),
  addWebpackAlias({
    ['@Components'] : resolve('src/components'),
    ['@Store'] : resolve('src/store'),
    ['@Page'] : resolve('src/page'),
    ['@Services'] : resolve('src/services'),
    ['@Utils'] : resolve('src/utils')
  })
)
```



### 	6 修改package.json

```json
// 示例
"proxy": "http://mol.uat.emarineonline.com"
```

​	

### 	7 elintrc.js （酌情处理错误）