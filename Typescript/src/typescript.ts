// for (var i = 0; i < 10; i++) {
//     console.log('for循环的console', i)
//     setTimeout(function () {
//         console.log(i);
//     }, 100 * i);
// }
// for (var i = 0; i < 10; i++) {
//     (function(i) {
//         setTimeout(function() { console.log(i); }, 100 * i);
//     })(i);
// }
// var _loop_1 = function (i) {
//     console.log('for循环的console', i);
//     setTimeout(function () {
//         console.log(i);
//     }, 100 * i);
// };
// for (var i = 0; i < 10; i++) {
//     _loop_1(i);
// }


// for (let i = 0; i < 10; i++) {
//     console.log('for循环的console', i)
//     setTimeout(function () {
//         console.log(i);
//     }, 100 * i);
// }

// function fa(input: Boolean) {
//     let a = 100;

//     if (input) {
//         let b = a + 1;
//         return b;
//     }

//     // Error: 'b' doesn't exist here
//     return b;
// }

//暂时性死区
// 不能在'a'被声明前调用'foo'
// 运行时应该抛出错误

// let a; 
// foo();

// function foo() {
//     // okay to capture 'a'
//     return a;
// }

// console.log(f(true))

// const livesForCat = 9
// const kitty = {
//     name: 'panhe',
//     numLive: livesForCat
// }

// // Cannot assign to 'kitty' because it is a constant.
// // kitty = {
// //     name: '淘汰',
// //     numLive: livesForCat
// // }

// kitty.name = '淘汰'

// console.log(kitty)

// 解构
// let input = [1, 2]
// // const [first, sec] = input
// // console.log(first, sec)
// function f([first, sec]:[number, number]) {
//     console.log(first)
//     console.log(sec)
// }
// f(input)

// 展开
let first = [1, 2]
let second = [3, 4]
let bothPlus = [0, ...first, ...second, 5]
console.log(bothPlus)
console.log(first)
console.log(second)