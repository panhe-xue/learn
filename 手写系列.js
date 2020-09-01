// // 防抖

// function debounce(fn, wait) {
//     let timer = null
//     return function() {
//         if(timer) clearTimeout(timer)
//         timer = setTimeout(() => {
//             fn.apply(this, arguments)
//         }, timer)
//     }
// }

// // 节流
// function throttle(fn, time) {
//     let prev = 0
//     return function() {
//         const now = new Date()
//         if(now - prev > time) {
//             fn.apply(this, arguments)
//             prev = now
//         }
//     }
// }

// // call
// Function.prototype.call = function(context, ...args) {
//     context = Object(context) || window
//     const fn = Symbol()
//     context[fn] = this
//     const res = context[fn](...args)
//     delete context[fn]
//     return res
// }

// // apply
// Function.prototype.apply = function(context, argArr) {
//     context = Object(context) || window
//     const fn = Symbol()
//     context[fn] = this
//     const res = context[fn](...argArr)
//     delete context[fn]
//     return res
// }

// Function.prototype.bind = function(context, ...args) {
//     return (...newArgs) => {
//         return this.call(context, ...args, ...newArgs)
//     }
// }

// const person = {
//     name: 'panhe',
//     age: 27
// }

// function cs() {
//     console.log('cs', this.name)
// }
// const fn = cs.bind(person)

// fn()


// // 1, 创建一个对象
// // 2, 新对象的prototype属性指向 构造函数的原型
// // 3, this指向新对象
// // 4, 构造函数如果不是返回对象或者函数，则返回这个新对象

// function New (func, ...args) {
//     // let res = {}
//     // if(func.prototype !== null) {
//     //     res.__proto__ = func.prototype
//     // }
//     let res = Object.create(func.prototype)
//     const r = func.call(res, ...args)
//     if((typeof r !== 'object' || typeof r !== 'function') && r !== null) {
//         return r
//     }
//     return res
// }
// function A () {
//     this.name = 'ph'
//     // return {
//     //     a: 1
//     // }
//     return function() {
//         return {a: 1}
//     }
// }
// A.prototype.say = function() {
//     return 'asy'
// }

// const a = new A()
// console.log(a, 'a')

// // 深拷贝

// function deepCopy(obj) {
//     if(typeof obj === "object") {
//         let res = obj.constructor === Array ? [] : {}
//         for(let i in obj) {
//             res = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i]
//         }
//         return res
//     }
//     return obj
// }

// // jsonp
// function jsonp(opts) {
//     // 拼接url
//     let url = `${opts.url}?callback=${opts.callback}`
//     for(let key in opts.data) {
//         url += `&${key}=${opts.data[key]}`
//     }
//     // 创建 script 标签
//     const script = document.createElement('script')
//     script.url = url
//     script.onload = function () {
//         document.body.removeChild(script)
//     }
//     document.body.appendChild(script)
// }

// jsonp({
//     url: 'localhost:3000',
//     data: {
//         name: 'ph',
//         age: 27
//     },
//     callback: 'getData'
// })

// function getData(data) {
//     console.log(data)
// }

// instanceof
function instanceof(A, B) {
    // B = B.prototype
    // A = A.__proto__
    while(true) {
        // if(A === null) return false
        // if(A === B) return true
        // A = A.__proto__
        console.log('aa')
    }
}
instanceof()