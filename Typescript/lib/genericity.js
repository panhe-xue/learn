// 泛型
function identity(arg) {
    return arg;
}
function logging(arg) {
    return arg;
}
// or
function loggings(arg) {
    return arg;
}
var myIdentity = loggings;
function iden(arg) {
    return arg;
}
var myIden = iden;
// 泛型类
var GenericNumber = /** @class */ (function () {
    function GenericNumber() {
    }
    return GenericNumber;
}());
var myGenericNumber = new GenericNumber();
myGenericNumber.zeroValue = 1;
myGenericNumber.add = function (x, y) { return x + y + this.zeroValue; };
console.log(myGenericNumber.add(2, 3));
function l(arg) {
    console.log(arg.length);
    return arg;
}
// l(3) // 泛型约束
l({ length: 3, a: 4 });
// 在泛型约束中使用类型参数
// function getProperty(obj: T, key: K) {
//     return obj[key];
// }
// let x = { a: 1, b: 2, c: 3, d: 4 };
// getProperty(x, "a"); // okay
// getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
// 在泛型里使用类类型
function create(c) {
    return new c();
}
//# sourceMappingURL=genericity.js.map