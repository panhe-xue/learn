// 完整的函数类型
let myAdd: (x: number, y:number) => number = function(x: number, y: number): number { return x + y }

// 可选参数
function buildName(firstName: string, lastName?: string): string {
    if(firstName) return firstName 
    else { return lastName|| "" }

}

//剩余参数 在javascript中，可以使用arguments 来访问所有传入的参数 typescript中，可以收集到一个变量里
function bulidNames(firsName: string, ...restOfname: string[]): string {
    return firsName + " " + restOfname.join(" ")
}

// this 和 箭头函数
