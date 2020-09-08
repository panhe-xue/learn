
/** --------------------------------------------------------------------排序------------------------------------------------------------------- */

// 冒泡排序 (较大的一个一个冒泡到后面)
function bubleSort(arr) {
  for( let outer = arr.length; outer >= 2; outer-- ) {
    for(let inner = 0; inner < outer -1 ; inner++) {
      if(arr[inner] > arr[inner+1]) {
        [arr[inner], arr[inner + 1]] = [arr[inner + 1], arr[inner]]
      }
    }
  }
  return arr
}

// 选择排序 (较小的一个一个比较到前面)
function selectSort(arr) {
  
  for (let outer = 0; outer < arr.length - 1; outer++ ) {
    for (let inner = outer + 1; inner < arr.length; inner++ ) {
      if(arr[outer] > arr[inner]) {
        [ arr[outer], arr[inner] ] = [ arr[inner], arr[outer] ]
      }
    }
  }
  
  return arr
}

// 插入排序 (以第一个为基准 遍历后面，并与前面比较，小则插入到前面)
function insertSort(arr) {

  for(let i = 1; i < arr.length; i++  ) {
    for(let j = i; j > 0; j--) {
      if(arr[j] < arr[j-1]) {
        [ arr[j], arr[j-1] ] = [ arr[j-1], arr[j] ]
      } else {
        break;
      }
    }
  }
  return arr
}

// 快速排序
function quickSort(array) {
  if(array.length < 2) {
    return array
  }
  let target = array[0]
  let left = []
  let right = []
  for(let i = 1; i < array.length; i++) {
    if(array[i] < target) {
      left.push(array[i])
    } else {
      right.push(array[i])
    }
  }

  return quickSort(left).concat(target, quickSort(right))
}

//





let a = [2, 5,3,7,4,9,12,4,56,77]
// console.log(bubleSort(a))
// console.log(selectSort(a))