// 防抖

function debounce(fn, wait) {
    let timer = null
    return function() {
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, timer)
    }
}

// 节流
function throttle(fn, time) {
    let prev = 0
    return function() {
        const now = new Date()
        if(now - prev > time) {
            fn.apply(this, arguments)
            prev = now
        }
    }
}

// call
Function.prototype.call = function(context, ...args) {
    context = Object(context) || window
    const fn = Symbol()
    context[fn] = this
    const res = context[fn](...args)
    delete context[fn]
    return res
}

// apply
Function.prototype.apply = function(context, argArr) {
    context = Object(context) || window
    const fn = Symbol()
    context[fn] = this
    const res = context[fn](...argArr)
    delete context[fn]
    return res
}

Function.prototype.bind = function(context, ...args) {
    return (...newArgs) => {
        return this.call(context, ...args, ...newArgs)
    }
}

const person = {
    name: 'panhe',
    age: 27
}

function cs() {
    console.log('cs', this.name)
}
const fn = cs.bind(person)

fn()


// 1, 创建一个对象
// 2, 新对象的prototype属性指向 构造函数的原型
// 3, this指向新对象
// 4, 构造函数如果不是返回对象或者函数，则返回这个新对象

function New (func, ...args) {
    // let res = {}
    // if(func.prototype !== null) {
    //     res.__proto__ = func.prototype
    // }
    let res = Object.create(func.prototype)
    const r = func.call(res, ...args)
    if((typeof r !== 'object' || typeof r !== 'function') && r !== null) {
        return r
    }
    return res
}
function A () {
    this.name = 'ph'
    // return {
    //     a: 1
    // }
    return function() {
        return {a: 1}
    }
}
A.prototype.say = function() {
    return 'asy'
}

const a = new A()
console.log(a, 'a')

// 深拷贝

function deepCopy(obj) {
    if(typeof obj === "object") {
        let res = obj.constructor === Array ? [] : {}
        for(let i in obj) {
            res = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i]
        }
        return res
    }
    return obj
}

// jsonp
function jsonp(opts) {
    // 拼接url
    let url = `${opts.url}?callback=${opts.callback}`
    for(let key in opts.data) {
        url += `&${key}=${opts.data[key]}`
    }
    // 创建 script 标签
    const script = document.createElement('script')
    script.url = url
    script.onload = function () {
        document.body.removeChild(script)
    }
    document.body.appendChild(script)
}

jsonp({
    url: 'localhost:3000',
    data: {
        name: 'ph',
        age: 27
    },
    callback: 'getData'
})

function getData(data) {
    console.log(data)
}

// instanceof
function _instanceof(A, B) {
    B = B.prototype
    A = A.__proto__
    while(true) {
        if(A === null) return false
        if(A === B) return true
        A = A.__proto__
    }
}

// 柯里化
function curry(fn, ...args) {
    if( args.length < fn.length) {
        return (...newArgs) => curry(fn, ...args, ...newArgs)
    } else {
        return fn(...args)
    }
}

function sum(a, b, c, d) {
    return a + b + c + d
}

const add = curry(sum, 1)
console.log(add(2)(3)(4))
console.log(add(2, 3)(4))

// EventEmitter 发布 订阅
class EventEmitter {
    constructor() {
        this.events = Object.create(null)
    }
    on(type, cb) {
      if(this.events[type]) {
          this.events[type].push()
      } else {
          this.events[type] = [cb]
      }
    }
    off(type, cb) {
        this.events[type] = this.events[type].filter(listener => listener !== cb)
    }
    emit(type, ...args) {
        if(this.events[type]) {
            this.events[type].map(listener => listener.call(this, ...args))
        }
    }
    once(type, cb) {
        const wrap = function() {
            cb(...arguments)
            this.off(type, wrap)
        }
        this.on(type, wrap)
    }
}

// 寄生组合继承
function inherit(subs, supers) {
    const middleObj = Object.create(supers.prototype)
    middleObj.constructor = subs
    subs.prototype = middleObj
}

function Super(name) {
    this.name = 'ph'
}

Super.prototype.getName = function() {
    return this.name
}

function Subs() {
    Super.call(this, name)
    this.name = 'ph'
}

Subs.prototype.getName = function() {
    return this.name
}

inherit(Subs, Super)

// //手写数组展平

let a = [1, [2, 3], 4]

const b = a.reduce((res, cur) => {
    if(Array.isArray(cur)) {
        return [...res, ...cur]
    }
    else {
        return [...res, cur]
    }
}, [])

console.log(b)

const flatten = function(arr) {
    return arr.reduce((res, cur) => {
      if(Array.isArray(cur)) {
          return [...res, ...flatten(cur)]
      } else {
          return [...res, ...cur]
      }
    }, [])
}

// 手写ajax
function ajax(url, data) {
  var request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onreadystatechange = function() {
    if(request.readyState === 4 && request.statue === 200) {
      console.log(request.responseText)
    }
  }
  request.send()
}

let dragging = false
let position = []
// 写个拖拽
document.addEventListener('mousedown', function(e) {
  dragging = false
  position = [ e.clientX, e.clinetY ]
})

document.addEventListener('mousemove', function() {
  
  if(dragging) return null
  const left = el.style.left
  const top = el.style.top
  const x = e.clientX
  const y = e.clientY
  const distanceX = x - position[0]
  const distanceY = y - position[1]
  el.style.left = left + distanceX
  el.style.top = top + distanceY

  position = [x, y]
})

document.addEventListener('mouseup', function(e) {
  dragging = false
})

// 正则去掉空格
String.prototype.trim = function() {
  return this.replace(/^\s|\s$/g, '')
}

// 