// 完整的函数类型
var myAdd = function (x, y) { return x + y; };
// 可选参数
function buildName(firstName, lastName) {
    if (firstName)
        return firstName;
    else {
        return lastName || "";
    }
}
//剩余参数 在javascript中，可以使用arguments 来访问所有传入的参数 typescript中，可以收集到一个变量里
function bulidNames(firsName) {
    var restOfname = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restOfname[_i - 1] = arguments[_i];
    }
    return firsName + " " + restOfname.join(" ");
}
// this 和 箭头函数
//# sourceMappingURL=function.js.map