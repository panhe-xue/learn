// class Animal {
//    private  name: string;
//     constructor(theName: string) { this.name = theName }
//     move(distanceNumber: number = 0) {
//         console.log(`${this.name} moved ${distanceNumber}m`)
//     }
// }
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Dep = /** @class */ (function () {
    function Dep(name) {
    }
    return Dep;
}());
var AccountingDep = /** @class */ (function (_super) {
    __extends(AccountingDep, _super);
    function AccountingDep(name) {
        return _super.call(this, name) || this;
    }
    AccountingDep.prototype.printMeeting = function () {
        console.log('打印.......');
    };
    return AccountingDep;
}(Dep));
//# sourceMappingURL=class.js.map