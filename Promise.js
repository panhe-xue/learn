
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

// // then接受成功方法
// asyncReadFile()
// .then(ret => console.log(ret.toString()))  // 输出 dome.txt的内容

// // then接受错误方法
// eventError()
// .then(null, err => console.log(err))  // 错误内容

// // catch方法
// eventError()
// .catch(err => console.log(err))  // 错误内容

// // resolve同步
// sync()
// .then(err => console.log(err))  // 错误内容

// // then的链式调用，接受上个 then 的 return 值，并且是一个新的promise对象
// _setTimeout
// .then(ret => console.log(ret))  // 1.5后打印 setTimeout
// .then(ret => { console.log(ret); return 'aaa' }) // undefined
// .then(ret => console.log(ret)) // aaa


// // all静态方法。接受一个Promise实例数组。等所有实例异步完成以后执行then, 返回结果对应。
// Promise
// .all([asyncReadFile(), _setTimeout()])
// .then(ret => {
//     console.log(ret) // ['demo.txt文件内容', 'setTimeout']
// })

// // race静态方法。接受一个Promise实例数组。其中实例异步完成以后执行then, 返回它的结果。
// Promise
// .race([asyncReadFile(), _setTimeout()])
// .then(ret => {
//     console.log(ret)
// })

// Promise.resolve(3).then(ret => console.log(ret))

// // then 的链式调用并且return 一个Promise 对象，等改Promise执行完一会在执行then, then参数为改Promise的resolve/reject值。这个不在这次手写中验证
// // 打印顺序 'demo.txt文件内容' ->（1.5s later...） 'setTimeout'
// asyncReadFile().then(ret => {
//     console.log(ret.toString())
//     return _setTimeout()
// })
// .then(ret => {
//     console.log(ret)
// })


// // 漏洞
// new Promise((resolve) => {
//     setTimeout(() => resolve(1), 500)
//     setTimeout(() => resolve(2), 1500)
// })
// .then(ret => console.log(ret))

_setTimeout()
.catch((value) => {
    console.log(res, '00')
})