## React-router-dom 使用方法

本文大部分内容来自 [官网](https://reactrouter.com/web/guides/primary-components)

### 前言

​	 如果你想测试react-router-dom 的基本使用方法，那你首先需要跑一个 react 应用。如果需要，我推荐你使用 create-react-app 脚手架，这是最快最简单的方式之一。



### 环境准备

```bash
npx create-react-app demo-app
cd demo-app
npm install
npm install react-router-dom
```



### 基本路由 

​	安装上面的环境并且跑起来以后。修改index.js代码，并且来看下 BrowserRouter,Route,Switch,Link 的基本使用

​	index.js

```react
import ReactDOM from 'react-dom';
import Home from './page/Home'
import About from './page/About'
import Me from './page/Me'
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'

ReactDOM.render(
  <Router >
    <nav>
      <ul>
        <li><Link to="/home" >Home</Link></li>
        <li><Link to="/about" >About</Link></li>
        <li><Link to="/me" >Me</Link></li>
        <li><Link to="/other" >other</Link></li>
      </ul>
    </nav>
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/me">
        <Me />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
```

1. 最外层需要Router ( 实际是 BrowserRouter/hashRouter ) 包裹，如果不包裹，你将会得到如下的报错. Error: Invariant failed: You should not use <Link> outside a <Router>。 

2. 基本使用结构如下。其中 Link最终转成 a标签，<Link />会根据路由去匹配不同的<Route />。

   不同的<Route /> 放在<Switch />里面。但是经过测试，<Route />组件也可以不放在里面。

   ```react
   <Router>
   	<Link></Link>
   	<Switch>
   		<Route></Route>
   		<Route></Route>
   	</Switch>
   </Router>
   ```

3. <Route path="/me"> <Home /></Route> 这种写法，在Home 组件中将不会有 history,location,match 等props。
   然而这种写法会有，<Route path="/home" component={Home} ></Route>这种写法可以获取。不知道是路由库升级还是其他原因，将在原理一文中弄清楚原因。

### 嵌套路由

​	假设嵌套业务逻辑发生在Home 里面。其中index.js代码相同。

Home.js

```react
import React from 'react';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'

function Home() {
    let match = useRouteMatch()
  return (
    <div className="Home">
      <h1>首页</h1>
      <ul>
          <li><Link to={`${match.url}/m1`}>模块1</Link></li>
          <li><Link to={`${match.url}/m2`}>模块2</Link></li>
          <li><Link to={`${match.url}/m3`}>模块3</Link></li>
      </ul>
      <Switch>
        <Route path={`${match.url}/m1`}>
            <div>模块一的内容</div>
        </Route>
        <Route path={`${match.url}/m2`}>
            <div>模块二的内容</div>
        </Route>
        <Route path={`${match.url}/m3`}>
            <div>模块三的内容</div>
        </Route>
      </Switch>
    </div>
  );
}

export default Home;
```
​	这个例子展示了一个嵌套路由如何使用。基本和前面用法相同，但其中2点不同。

1. <Link> 标签不需要放在<Router />里。全局只需要一个<Router />标签。
2.  match = useRouteMatch() 获取到父级的路由，并加在子路由前面。



由于动态路由和编程式路由都是上面改变来的，比较简单，这里就不举例了。



### 小结

路由组件分三类。

1. Routers 比如, <BrowserRouter /> 和 <HashRouter />
2. Route matchers，比如： <Switch />和 <Route />
3. Navigation 导航组件,比如： <Link />，以及没有提到的，<NavLink /> and <Redrect />



下面是对小结部分的一点知识补充。

#### routers

​	router 是每一个react-router 应用的核心，类似html 结构树中 <html /> 标签一样，他们是整个应用的根元素。由react-router-dom 库提供的 <BrowserRouter /> 和 <HashRouter /> 的里面存放着 location 和 history ，子组件都将依赖它。但他们主要的不同是 浏览器中url 的表现形式以及与服务器交流的方式。

- <BrowserRouter />	使用最常规的 url形式。url 看起来像这样: http://example.com/home/m3。但是这种它需要服务端能够正确配置页面路由并且和前端相同。在Creat React App 脚手架中 development 模式下的服务已经做好了处理，但是当npm run build以后的服务端，需要自己去配置。参考 [这里](https://create-react-app.dev/docs/deployment#serving-apps-with-client-side-routing)
- <HashRouter /> 使用了哈希形式的url ，url看起来是这样的：http://example.com/#/your/page。因为这种不会发送消息给后台，因此不需要服务端去配置路由信息

在使用router组件时确保它是app 的根组件，<App />组件应该放在其内部，像这样

```react
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

function App() {
  return <h1>Hello React Router</h1>;
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```



### Route matchers

​	在react-router-dom 中提供了2个匹配组件，<Route /> 和 <Switch />组件。

​	<Route />组件一般是 <Switch /> 组件的子元素。当<Switch />进行渲染的时候，会根据当前浏览器的与

<Route path />进行匹配如果匹配上了，将进行渲染该Route里的compnent。如果没有匹配到，<Switch />将不会渲染任何东西

​	值得一提的是，<Route path>非精确匹配规则是，当开头匹配到了， 就会渲染第一个匹配到组件 。比如当前url 为 ‘/home, 此时有一个 <Route path="/" >放在了第一的位置，那么将渲染该组件。由于这个特性我们可以将<Route path="/">放在最后 进行适配。

如果想解决该问题，可以进行精准匹配，<Route exact path="/" />



### Navigation

React-router 提供了 <Link />组件进行导航。不管<Link />在哪里使用，都将渲染成 <a />标签

然而<NavLink />是一个特殊的 <Link />标签。当 改link 被匹配到时，可以设置  'active' class。

```jsx
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
// When the URL is /react, this renders:
// <a href="/react" className="hurray">React</a>

// When it's something else:
// <a href="/react">React</a>
```

当你在任何时候想强制导航到其他url, 可以使用 <Redirect />导航标签。

```jsx
<Redirect to="/login" />
```



### Hooks

​	React Router 提供了以下4个有用的Hook，可以在任何组件内部使用它。前提是你的react 版本号 >=16.8

- useHistory
- useLocation
- useParams
- useRouteMatch



#### useHistory

​	useHistory  hook 提供了history对象，获取其可以进行导航设置。history实例中包含了

​	action,block,createHref,go,goBack,goForward,length,listen,location,push,replace等属性

```jsx
import { useHistory } from "react-router-dom";

function HomeButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/home");
  }

  return (
    <button type="button" onClick={handleClick}>
      Go home
    </button>
  );
}
```

history 对象： 

1. action: "PUSH"
2. block: *ƒ block(prompt)*
3. createHref: *ƒ createHref(location)*
4. go: *ƒ go(n)*
5. goBack: *ƒ goBack()*
6. goForward: *ƒ goForward()*
7. length: 30
8. listen: *ƒ listen(listener)*
9. location: {pathname: "/home/m1", search: "", hash: "", state: undefined, key: "6odisu"}
10. push: *ƒ push(path, state)*
11. replace: *ƒ replace(path, state)*
12. __proto__: Object



#### useLocation

​	useLocation hook产生的 location 实例，是一个对象	 {pathname: "/home/m1", search: "", hash: "", state: undefined, key: "6odisu"},可以获取当前页面的url

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  useLocation
} from "react-router-dom";

function usePageViews() {
  let location = useLocation();
  React.useEffect(() => {
    ga.send(["pageview", location.pathname]);
  }, [location]);
}

function App() {
  usePageViews();
  return <Switch>...</Switch>;
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  node
);
```



#### useParams

​	useParams hook 使用在动态路由里面，便于获取当前动态参数.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

function BlogPost() {
  let { slug } = useParams();
  return <div>Now showing post {slug}</div>;
}
ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/blog/:slug">
        <BlogPost />
      </Route>
    </Switch>
  </Router>,
  node
);
```



#### useRouteMatch

获取当前url 相关参数。对用实例返回的属性包括 isExact，params，path， url

```jsx
import React from 'react';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'

function Home(props) {
    let match = useRouteMatch()

    console.log(match, '===============>>>>>>>')
  return (
    <div className="Home">
      <h1>首页</h1>
    
    </div>
  );
}

export default Home;

```

