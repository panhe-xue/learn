### 											react-router-dom 源码浅析

### 前言

​		上篇文章中介绍了 [React Router](https://juejin.im/post/6860862817520582663) 的一些基本用法，这一篇文章将对其源码进行浅析。在本篇幅中，也会搞清楚上篇留下的和心中疑惑的几个问题：

1. 在上篇中，测试证明了Route组件也可以不放在Switch组件中，那么Switch组件的真正作用是什么？
2. 在Route 渲染组件的时候，需要渲染的组件已子组件的形式传入Route组件将在内部拿不到history，location 等对象，以compent,render 方式传入将会拿到这些对象，这是为什么？
3. BrowserRouter 和 HashRouter 与服务器怎么交流的？
4. react-router是如何做到不同的地址，匹配不同组件？

​		ok，在这以前，你需要先在github 上 clone 一份react-router代码，目前最新版本是 5.2.0。

​		git clone https://github.com/ReactTraining/react-router.git



### BrowserRouter

​	文件目录在这里就不细说了，默认是你已经克隆了react-router源码。

​	根据查找文件规则，当我们 import { BrowserRouter } from 'react-router-dom' 的时候，我们会找到  '...\react-router-master\react-router-master\packages\react-router-dom\modules\BrowserRouter.js' 文件。

```react
import React from "react";
import { Router } from "react-router";
import { createBrowserHistory as createHistory } from "history";
import PropTypes from "prop-types";
import warning from "tiny-warning";

/**
 * The public API for a <Router> that uses HTML5 history.
 */
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router 
    	history={this.history} 
    	children={this.props.children} 
    />;
  }
}

if (__DEV__) {
  BrowserRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number
  };

  BrowserRouter.prototype.componentDidMount = function() {
    warning(
      !this.props.history,
      "<BrowserRouter> ignores the history prop. To use a custom history, " +
        "use `import { Router }` instead of `import { BrowserRouter as Router }`."
    );
  };
}

export default BrowserRouter;

```

这里我们知道，BrowserRouter 是一个高阶组件，本质是返回 react-router 的 Router 组件。并且通过history 库创建一个history 实例 和子组件内容一并传入了 Router 组件中。整个React Router 的 history实例都是来自这里。

​	所以我们我们其实需要关注的是 react-router库的Router 组件以及history 库的  createBrowserHistory 方法。

​	经过我们思考，Router组件本质大概是根据 浏览器的 url 实现逻辑操作，但是最终还是去调用 history 库提供的一些方法。所以弄清楚history 对象才是本质。
​	那我们先从history 开始。

### history API

​	下载history 库： git clone  https://github.com/ReactTraining/history.git

​	在项目中找到  yourPath\history\packages\history\index.ts文件中的函数 createBrowserHistory。
```react
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history; // 最基础的

  function getIndexAndLocation(): [number, Location] {
  }
  function handlePop() {

  }

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to);
  }
  function getNextLocation(to: To, state: State = null): Location {
  }
  function getHistoryStateAndUrl(
  }
  function allowTx(action: Action, location: Location, retry: () => void) { }
  
  function applyTx(nextAction: Action) { }
    
  function push(to: To, state?: State) {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }
    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
      try {
        globalHistory.pushState(historyState, '', url); // 这里调用 pushState
      } catch (error) {
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to: To, state?: State) {}

  function go(delta: number) {
    globalHistory.go(delta);
  }

  let history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {}
  };

  return history;
}
```

createBrowserHistory 函数返回一个 history 对象，里面包含了大家经常使用的push, go, back,replace等等方法。从 let globalHistory = window.history;  看出这些方法最终调用的 window.history 对象的方法。本质还是需要弄清楚 html5 的 history 的东西（[参考这里](https://developer.mozilla.org/zh-CN/docs/Web/API/History)）。

window.history 常用api:

1. **history.length** 

   在同一tab 下浏览器产生的历史纪录个数

2. **history.pushState(state, title, url)**

   将指定名称和url 推进浏览器会话历史栈。浏览器地址栏将更换地址但是不刷新。单页面应用真是根据这个特新监听地址变化，来渲染页面并且不刷新页面。state是传入的任何对象，可以通过history.state 获取，title是将在浏览器标签栏显示的标题文案，url是新的地址。

3. **history.replaceState(state, title, url)**

   与history.pushState差不多，不同的是该api 直接更新当前会话的数据和url

4. **history.back()、history.forward()、history.go()：**

   分别是后退一个历史会话，前进一个历史会话。history.go(n) 前端n个会话，当n 为负数将后退n个会话

   

到这里我们试着理解一下文章开始的第三个问题：**BrowserRouter 和 HashRouter 与服务器怎么交流的？**

​	通过源码对比 createBrowserHistory 和  createHashHistory 我们会发现，当他们的push 方法最终都是调用window.history.pushState() 方法，唯一不同的地方就是拼接参数。

```javascript
// createBrowserHistory
function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to);
 }
```

```javascript
// createHashHistory
function createHref(to: To) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
 }
```

由于Html5 知识点可以知道，hash 类型的url 在请求页面的时候，#后面的值是不带给服务器的。所以 BrowserRouter 组件的url 发送给服务器，而 HashRouter 组件的url 是不再去请求服务器。

### react-router API

​	react -router 组件是我们的重头戏，它内部的原理必定会是，当监听到 location 变化，从而重新匹配组件进行渲染。我看源码的结论是： react-router 提供2个组件，Router和 Route，其中Router 注入history，location 等实例属性，并且监听location 变化，进行setState。Route组件进行匹配组件进行渲染。当Router 进行SetState 时，会触发Route 组件重新匹配渲染。其中react-router使用了  [create-react-context](https://www.npmjs.com/package/create-react-context) 这个库，实现了数据绑定。

#### Router

```react
import React from "react";
import PropTypes from "prop-types";
import warning from "tiny-warning";

import HistoryContext from "./HistoryContext.js";
import RouterContext from "./RouterContext.js";

class Router extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    if (!props.staticContext) {
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      });
    }
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}

export default Router;

```

从源码知道，Router 组件设置了一个state.location  ，并且把history ，location 注入RouterContext。history 和子组件(就是Route)组件注入HistoryContext 。并且监听了history的变化 props.history.listen(() => { // 改变location })。

####  Route

​	route组件大致内容如下

```react
import React from "react";

import RouterContext from "./RouterContext.js";
import matchPath from "./matchPath.js";

class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = this.props.location || context.location;
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
            ? matchPath(location.pathname, this.props)
            : context.match;

          const props = { ...context, location, match };

          let { children, component, render } = this.props;

          return (
            <RouterContext.Provider value={props}>
              {props.match
                ? children
                  ? typeof children === "function"
                    ? __DEV__
                      ? evalChildrenDev(children, props, this.props.path)
                      : children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? render(props)
                  : null
                : typeof children === "function"
                ? __DEV__
                  ? evalChildrenDev(children, props, this.props.path)
                  : children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

if (__DEV__) {};
}

export default Route;

```

这里我们可以回答第2个问题和第4个问题了：

​	2，在Route 渲染组件的时候，需要渲染的组件已子组件的形式传入Route组件将在内部拿不到history，location 等对象，以compent,render 方式传入将会拿到这些对象，这是为什么？

​	从Route组件大致可以看出，当传入children 对象为组件的时候，会直接渲染该组件，其他情况则传入了props 对象。

​	4，react-router是如何做到不同的地址，匹配不同组件？

​	一切是 matchPath 函数得出结论



####  Switch

```react
import React from "react";
import PropTypes from "prop-types";
import invariant from "tiny-invariant";
import warning from "tiny-warning";

import RouterContext from "./RouterContext.js";
import matchPath from "./matchPath.js";

class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Switch> outside a <Router>");

          const location = this.props.location || context.location;

          let element, match;

          React.Children.forEach(this.props.children, child => {
            if (match == null && React.isValidElement(child)) {
              element = child;

              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });

          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
```

对于第一个问题：在上篇中，测试证明了Route组件也可以不放在Switch组件中，那么Switch组件的真正作用是什么？
	：Switch 和 Route 组件都是由 RouterContext.Consumer 包裹，可以单独渲染其中任何一个组件。故 Route 组件可以放在Switch里面，也可以单独使用。Switch 组件还是用matchPath 函数进行判断，如果匹配到了子组件的就用 React.cloneElement(element, {}) 渲染对应的组件，如果没有匹配则是null。
	Switch 组件中的 if (match == null && React.isValidElement(child)) {} 说明为什么 只会渲染第一个匹配到的组件了。

注意： 本文默认你已经知道 matchPath 函数的逻辑。