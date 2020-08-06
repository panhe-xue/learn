### 前言

​	相信来看手写Promise的小可爱们，都或多或少知道Promise的使用方法和作用。所以这里就不详细介绍Promise的历史背景和作用，简单介绍一下，各种使用方法，和自己手写Promise的过程，作为一个学习记录。



### 使用方法

​	写一个Promise的测试文件。版本比较高的node版本已经支持Promise写法，直接node运行此文件来进行调试即可。

```javascript
// Promise.js
const fs = require("fs")
function asyncReadFile() {
    return new Promise((resolve, reject) => {
        fs.readFile('./demo.txt', (err, data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}
function eventError() {
    return new Promise((resolve, reject) => {
        fs.readFile('./demo.txt', (err, data) => {
            reject("错误内容")
        })
    })
}

function _setTimeout() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("setTimeout")
        }, 1500)
    })
}

function sync() {
    return new Promise((resolve, reject) => {
        resolve(88)
    })
}

// then接受成功方法
asyncReadFile()
.then(ret => console.log(ret.toString()))  // 输出 dome.txt的内容

// then接受错误方法
eventError()
.then(null, err => console.log(err))  // 错误内容

// catch方法
eventError()
.catch(err => console.log(err))  // 错误内容

// resolve同步
sync()
.then(err => console.log(err))  // 错误内容

// then的链式调用，接受上个 then 的 return 值，并且是一个新的promise对象
_setTimeout
.then(ret => console.log(ret))  // 1.5后打印 setTimeout
.then(ret => { console.log(ret); return 'aaa' }) // undefined
.then(ret => console.log(ret)) // aaa


// all静态方法。接受一个Promise实例数组。等所有实例异步完成以后执行then, 返回结果对应。
Promise
.all([asyncReadFile(), _setTimeout()])
.then(ret => {
    console.log(ret) // ['demo.txt文件内容', 'setTimeout']
})

// race静态方法。接受一个Promise实例数组。其中实例异步完成以后执行then, 返回它的结果。
Promise
.race([asyncReadFile(), _setTimeout()])
.then(ret => {
    console.log(ret)
})

Promise.resolve(3).then(ret => console.log(ret))

// then 的链式调用并且return 一个Promise 对象，等改Promise执行完一会在执行then, then参数为改Promise的resolve/reject值。这个不在这次手写中验证
// 打印顺序 'demo.txt文件内容' ->（1.5s later...） 'setTimeout'
asyncReadFile().then(ret => {
    console.log(ret.toString())
    return _setTimeout()
})
.then(ret => {
    console.log(ret)
})


// 漏洞
new Promise((resolve) => {
    setTimeout(() => resolve(1), 500)
    setTimeout(() => resolve(2), 1500)
})
.then(ret => console.log(ret))
```

总结下Promise的一些基本结构：

1. promise是一个类。
2. 构造函数的参数是一个函数fn，fn 的参数有2个参数，一个参数是成功时候的调用，一个是失败时候调用
3. promise对象有一个then方法，一个是成功的回调，一个是失败的回调
4. then方法支持链式调用
5. then返回了一个新的promise对象
6. promise对象有一个 catch方法，捕捉reject的抛出的错误
7. Promise静态方法all, race;
8. Promise 状态只能从pending到 reslove 或者reject 的状态


 Promise是一个类

```bash
	class Promise {
	}
```

构造函数第一个参数为一个函数，该函数暴露的2个函数作为参数，第一个为参数为成功的时候调用,第二个为失败的时候调用

```
   	class Promise {
   		constructor(fn) {
   			const resolve = () => {
   				console.log('sucess!')
   			}
   			const reject = () => {
   				console.log('reject!!!')
   			}
   			fn(resolve, reject)
   		}
   	}
```



### 实现基本结构和then异步调用 -- 发布订阅

​	结合上面特点，我们实现一个简单的Promise
```

class _Promise {

    constructor(executor) {
        this.status = 'pending' // resolved rejected
        this.value = null // 当前值
        this.reason = null // 当前拒绝原因

        this.onResolveCallbacks = [] // 事件发布订阅容器
        this.onRejectedCallbacks = [] // 拒绝容器

        const resolve = function(value) { // reslove调用的函数
            this.status = 'resolved'
            this.value = value
            if(this.onResolveCallbacks.length === 0) return
            this.onResolveCallbacks.forEach(fn => fn(this.value))
        }

        const reject = function(reject) { // reject调用的函数
            this.status = 'rejected'
            this.reason = reject
            if(this.onRejectedCallbacks.length === 0) {
                console.warn('UnhandledPromiseRejectionWarning:', this.reject)
                console.warn('UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().') 
                return
            }
            this.onRejectedCallbacks.forEach(fn => fn(this.reason))
        }

        executor(resolve, reject) // 执行传进来的函数
    }

    then(onFulfilled, onRejected) { // 实现内部then方法
        if(this.status === 'pending') { // 把方法推入容器，等待调用，下面同理
            this.onResolveCallbacks.push(onFulfilled)
            this.onRejectedCallbacks.push(onRejected)
        }
        if(this.status === 'resolved') {
            onFulfilled(this.value)
        }
        if(this.status === 'rejected') {
            onRejected(this.reason)
        }
    }
    catch(onRejected) {
        if(this.status === 'pending') {
            this.onRejectedCallbacks.push(onRejected)
        }
        if(this.status === 'rejected' || this.status === 'resolved') {
            onRejected(this.reason)
        }
    }
}

```
上面的实现了基本的方法，但是还存在许多问题，比如还没有链式调用等等...


### 实现then的同步调用 -- 之漏洞一
	

### 实现then的链式调用

### 实现catch方法

### 实现静态方法resolve

### 实现静态方法reject

### 实现静态方法 all

### 实现静态方法 race

