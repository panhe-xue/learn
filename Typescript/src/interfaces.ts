// interface LabelledValue {
//     readonly label: string
// }
// function printLable(labelObject: LabelledValue) {
//     console.log(labelObject.label)
// }

// const myObj: LabelledValue = {
//     label: '标签'
// }
// myObj.label = '改变的label'

// printLable(myObj)

// ReadOnlyArray
// let a: number[] = [1, 2, 3]
// let ro: ReadonlyArray<number> = a
// console.log(ro[0])

// 额外的属性检测
// interface SquareConfig {
//     color?: string;
//     width?: number;
// }

// // function createSquare(config: SquareConfig): { color: string, area: number } {
// //  //....
// // }
// function createSquare(config: SquareConfig): { color: string; area: number } {
//     // ...
// }
// let mySquare = createSquare({color: "red", width: 10} as SquareConfig)

// 函数类型
// interface SearchFunc {
//     (source: string, subString: string): boolean
// }
// let mySearch: SearchFunc;
// mySearch = function(source: string, subString: string) {
//     return source.search(subString) > -1
// }

// 可索引类型
// interface StringArray{
//     [index: number]: string
// }
// let myArray: StringArray;
// myArray = ['Bob', 'Fred']

//混合类型
// interface Counter {
    
// }

// 类型兼容
interface Named {
    name: string
}

class Person {
    name: string;
}

let p: Named
p = new Person()
