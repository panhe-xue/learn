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