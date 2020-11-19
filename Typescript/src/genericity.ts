// 泛型
function identity<T>(arg: T): T {
    return arg
}

function logging<T>(arg: T[]): T[] {
    return arg
}

// or
function loggings<T>(arg: Array<T>): Array<T> {
    return arg
}

let myIdentity: <C>(arg: C[]) => C[] = loggings

// 泛型接口
interface GenericIdentityFn<T> {
    <T>(arg: T): T;
}

function iden<T>(arg: T): T {
    return arg
}

let myIden: GenericIdentityFn<number> = iden;

// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 1;
myGenericNumber.add = function(x, y) { return x + y + this.zeroValue }
console.log(myGenericNumber.add(2, 3))

// 泛型约束
interface Lengthwise {
    length: number;
}

function l<T extends Lengthwise>(arg: T): T {
    console.log(arg.length)
    return arg
}
// l(3) // 泛型约束

l({ length: 3, a: 4 })

// 在泛型约束中使用类型参数
// function getProperty(obj: T, key: K) {
//     return obj[key];
// }

// let x = { a: 1, b: 2, c: 3, d: 4 };

// getProperty(x, "a"); // okay
// getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.

// 在泛型里使用类类型
function create<T>(c: { new(): T }): T {
    return new c();
}