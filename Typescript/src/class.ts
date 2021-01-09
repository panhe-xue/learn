// class Animal {
//    private  name: string;
//     constructor(theName: string) { this.name = theName }
//     move(distanceNumber: number = 0) {
//         console.log(`${this.name} moved ${distanceNumber}m`)
//     }
// }

// // class Snake extends Animal {
// //     constructor(name: string) {
// //         console.log('snake constructor')
// //         super(name)
// //     }
// //     move(dis: number) {
// //         console.log('super')
// //         super.move(dis)
// //     }
// // }



// const animal = new Animal('dog')
// animal.move(29).

// let passcode = true

// // 存取器
// class Employee {
//     private _fullname: string;

//     get fullName(): string {
//         return this._fullname
//     }

//     set fullName(name: string) {
//         if(passcode) {
//             this._fullname = name
//         } else {
//             console.error('passcode error!!')
//         }
//     }
// }

// 抽象类
abstract class Dep {
    constructor(name: string) {
        
    }
    abstract printMeeting(): void;
}

class AccountingDep extends Dep {
    constructor(name: string) {
        super(name)
    }
    printMeeting() {
        console.log('打印.......')
    }
}