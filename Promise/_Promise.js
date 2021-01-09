const { on } = require("process")

class _Promise {

    constructor(executor) {
        this.status = 'pending' // resolved rejected
        this.value = null
        this.reason = null

        this.onResolveCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = function(value) {
            setTimeout(() => {
                this.status = 'resolved'
                this.value = value
                if(this.onResolveCallbacks.length === 0) return
                this.onResolveCallbacks.forEach(fn => fn(this.value))
            }, 0)
        }

        const reject = function(reject) {
            setTimeout(() => {
                this.status = 'rejected'
                this.reason = reject
                if(this.onRejectedCallbacks.length === 0) {
                    console.warn('UnhandledPromiseRejectionWarning:', this.reason)
                    console.warn('UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().') 
                    return
                }
                this.onRejectedCallbacks.forEach(fn => fn(this.reason))
            }, 0)
        }

        executor(resolve.bind(this), reject.bind(this))
    }

    then(onFulfilled, onRejected) {
        if(this.status === 'pending') {
            onFulfilled && this.onResolveCallbacks.push(onFulfilled)
            onRejected && this.onRejectedCallbacks.push(onRejected)
        }
        if(this.status === 'resolved') {
            onFulfilled && onFulfilled(this.value)
        }
        if(this.status === 'rejected') {
            onRejected &&  onRejected(this.reason)
        }
    }
    catch(onRejected) {
        return this.then(null, onRejected)
    }

}

_Promise.resolve = value => new _Promise(resolve => resolve(value))

_Promise.reject = value => new _Promise((resolve, reject) => reject(value))

_Promise.race = promises =>
  new _Promise((resolve, reject) =>
    promises.forEach(pro => pro.then(resolve, reject))
  )

_Promise.all = () => {
    
}


const fs = require("fs")
const { resolve } = require("path")
function asyncReadFile() {
    return new _Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("setTimeout1")
        }, 150)
    })
}
function _setTimeout() {
    return new _Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("setTimeout")
        }, 1500)
    })
}

_Promise.race([_setTimeout(), asyncReadFile()])
.then(res => console.log('aaaaa', res))



// asyncReadFile()
// // .then((res) => {
// //     console.log(res, '----')
// // })
// .catch(res => console.log(res, '-----'))