
class _Promise {
    
    constructor(executor) {
        this.state = 'pending'
        this.value = null
        this.reason = null

        this.onResovleCallbacks = []
        this.onRejectedCallbacks = []
        
        const resolve = function(value) {
            this.value = value
            if(this.onResovleCallbacks.length === 0) return
            this.onResovleCallbacks.forEach(fn => fn()) 
        }
    
        const reject = function(reject) {
            this.reason = reject
            if(this.onRejectedCallbacks.length === 0) { 
                console.warn('UnhandledPromiseRejectionWarning:', this.reject)
                console.warn('UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().') 
                return 
            }
            this.onRejectedCallbacks.forEach(fn => fn())
        }
        
        executor(resolve, reject)
    }

    then(onFulfilled, onRejected) {
        
    }
    catch() {

    }
}