// 枚举

// // 数字枚举
// enum Direction {
//     Up,
//     Down,
//     Left,
//     Right
// }
// console.log(Direction.Down)

// 
// enum FileAccess {
//     // constant members
//     None,
//     Read    = 1 << 1,
//     Write   = 1 << 2,
//     ReadWrite  = Read | Write,
//     // computed member
//     G = "123".length
// }
// console.log(FileAccess.Read, FileAccess.Write)

// 反向映射
// enum Enum {
//     A
// }
// const a = Enum.A
// console.log(Enum[a], a)

// 外部枚举
declare enum Enum {
    A = 1,
    B,
    C = 2
}

// console.log(Enum.B, Enum.C)