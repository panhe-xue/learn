
/** --------------------------------------------------------------------排序------------------------------------------------------------------- */

// 冒泡排序
function bubleSort(arr) {
  for( let outer = arr.length; outer >= 2; outer-- ) {
    for(let inner = 0; inner < outer -1 ; inner++) {
      if(arr[inner] > arr[inner+1]) {
        [arr[inner], arr[inner + 1]] = [arr[inner + 1], arr]
      }
    }
  }
}

// 选择排序