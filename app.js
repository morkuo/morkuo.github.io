//取得新增按鈕、透過新增按鈕取得待辦事項填寫表單的各欄位
let submit = document.querySelector("button.add");
let content = submit.parentElement.children[1];
let month = submit.parentElement.children[3];
let date = submit.parentElement.children[5];

//在按下新增按紐時，將待辦事項等資訊加入待辦清單
submit.addEventListener("click", e => {
  //避免預設跳轉到指定網址
  e.preventDefault();

  //如果未填寫待辦事項，跳出警告視窗要求填寫，並停止執行
  if (content.value === "") {
    alert("請輸入待辦事項");
    return;
  }

  //依照使用者填寫的資訊，建立事項、時間元素，把它們組合起來放進待辦清單section
  let sec = document.querySelector("section.listSec");

  let todo = document.createElement("div");
  todo.classList.add("todo");

  let todoItem = document.createElement("p");
  todoItem.classList.add("todoContent");
  todoItem.innerText = content.value;

  let todoTime = document.createElement("p");
  todoTime.classList.add("todoTime");
  todoTime.innerText = month.value + "/" + date.value;

  let completeButton = document.createElement("button");
  completeButton.innerText = "完成";
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "移除";

  sec.appendChild(todo);
  todo.appendChild(todoItem);
  todo.appendChild(todoTime);
  todo.appendChild(completeButton);
  todo.appendChild(deleteButton);

  //待辦清單的顯示動畫
  todo.style.animation = "scaleUp 0.3s forwards";

  //清空待辦事項填寫表單的「事項」欄位
  content.value = "";

  //把待辦事項裝進物件，存進localStorage的待辦清單
  let storeList = localStorage.getItem("list");
  if (storeList === null) {
    let todoObject = {
      content: todoItem.innerText,
      month: month.value,
      date: date.value,
    }
    let arrayList = JSON.stringify([todoObject]);
    localStorage.setItem("list", arrayList);
  } else {
    let arrayList = JSON.parse(storeList);
    let todoObject = {
      content: todoItem.innerText,
      month: month.value,
      date: date.value,
    }
    arrayList.push(todoObject);
    localStorage.setItem("list", JSON.stringify(arrayList));
  }

  //如果就特定事項按下完成按紐，把該事項加上 "done" class 讓css上刪除線
  completeButton.addEventListener("click", e => {
    todo.classList.toggle("done");
  })

  //如果就特定事項按下刪除按紐，把該事項從待辦清單中移除，並從LocalStorage刪除
  deleteButton.addEventListener("click", e => {
    //移除特定事項的動畫
    todo.style.animation = "scaleDown 0.3s forwards";

    //動畫完成後，移除此事項（div element）
    todo.addEventListener("animationend", () => {
      todo.remove();
    })

    //取得存在Localstorage裡的待辦清單，比對清單中各個事項的資訊跟此事項的資訊是否相同，如果相同，刪除清單裡的事項，重新存進Localstorage
    let storeList = localStorage.getItem("list");
    let arrayList = JSON.parse(storeList);
    arrayList.forEach((item, index) => {
      if (item.content == todoItem.innerText && item.month + "/" + item.date == todoTime.innerText) {
        arrayList.splice(index, 1);
      }
    })
    if (arrayList.length !== 0) {
      localStorage.setItem("list", JSON.stringify(arrayList));
    } else {
      localStorage.removeItem("list");
    }
  })
})

//顯示待辦清單
showList();

//定義showList()
function showList() {
  let storeList = localStorage.getItem("list");

  //如果localstorage裡面的待辦清單不是空的，則用每個清單中物件資訊，建立事項、時間元素，把它們組合起來放進待辦清單section
  if (storeList !== null) {
    let arrayList = JSON.parse(storeList);

    arrayList.forEach(item => {
      let sec = document.querySelector("section.listSec");

      let todo = document.createElement("div");
      todo.classList.add("todo");

      let todoItem = document.createElement("p");
      todoItem.classList.add("todoContent");
      todoItem.innerText = item.content;

      let todoTime = document.createElement("p");
      todoTime.classList.add("todoTime");
      todoTime.innerText = item.month + "/" + item.date;

      let completeButton = document.createElement("button");
      completeButton.innerText = "完成";
      let deleteButton = document.createElement("button");
      deleteButton.innerText = "移除";

      sec.appendChild(todo);
      todo.appendChild(todoItem);
      todo.appendChild(todoTime);
      todo.appendChild(completeButton);
      todo.appendChild(deleteButton);

      todo.style.animation = "scaleUp 0.3s forwards";

      completeButton.addEventListener("click", e => {
        todo.classList.toggle("done");
      })

      deleteButton.addEventListener("click", e => {
        todo.style.animation = "scaleDown 0.3s forwards";
        todo.addEventListener("animationend", () => {
          todo.remove();
        })
        arrayList.forEach((item, index) => {
          if (item.content == todoItem.innerText && item.month + "/" + item.date == todoTime.innerText) {
            arrayList.splice(index, 1);
          }
        })
        if (arrayList.length !== 0) {
          localStorage.setItem("list", JSON.stringify(arrayList));
        } else {
          localStorage.removeItem("list");
        }
      })
    })
  }
}

//按時間排序
let sort = document.querySelector("button.sort");
sort.addEventListener("click", () => {

  storeList = localStorage.getItem("list");
  if (storeList !== null) {
    let arrayList = JSON.parse(storeList);

    //用merge sort來排序，排完清單重新存進Localstorage
    let sortedArray = mergeSort(arrayList, 0, arrayList.length - 1);
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //透過一個for loop，把待辦清單section現有的事項都刪除（sec.children.length不可直接放進for loop condition，它會在for loop執行過程中變動）
    let sec = document.querySelector("section.listSec");
    let len = sec.children.length;
    for (let i = 0; i < len; i++) {
      sec.children[0].remove();
    }

    //重新透過showlist()把待辦清單組出來，放進待辦清單section
    showList();

  } else {
    alert("nothing to sort");
  }
})


//merge sort：把清單不斷地往下對半分，各剩下一個元素時，開始往回透過merge跟鄰近元素比較時間先後，然後重新向上拼湊成一個完整的清單。
function mergeSort(arr, p, q) {
  let result = [];
  if (p < q) {
    let middle = Math.floor((p + q) / 2);
    let r1 = mergeSort(arr, p, middle);
    let r2 = mergeSort(arr, middle + 1, q);
    return merge(r1, r2);
  } else {
    result.push(arr[p]);
    return result;
  }
}

//比較兩個部分各元素的時間先後，從時間在先的開始放入輔助陣列。其中一部分先處理完畢，則把另一部分也順著放進輔助陣列。
function merge(arr1, arr2) {
  let auxArray = [];
  let i = 0;    
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].month) < Number(arr2[j].month)) {
      auxArray.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].month) > Number(arr2[j].month)) {
      auxArray.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].month) == Number(arr2[j].month)) {
      if (Number(arr1[i].date) < Number(arr2[j].date)) {
        auxArray.push(arr1[i]);
        i++;
      } else {
        auxArray.push(arr2[j]);
        j++;
      }
    }
  }

  //剩下的第一部分或第二部分順著放進輔助陣列
  while (i < arr1.length) {
    auxArray.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    auxArray.push(arr2[j]);
    j++;
  }

  return auxArray;
}
