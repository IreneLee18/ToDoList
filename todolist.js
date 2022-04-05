const inputContent = document.querySelector('.toDoListContent');
const addBtn = document.querySelector('.btn_add');
const todoList = document.querySelector('#list');
const listCount = document.querySelector('.list_footer p');
const tab = document.querySelector('.tab');
const tabs = document.querySelectorAll('.tab li');
const deleteBtn = document.querySelector('.delete');
const clearAll = document.querySelector('.clear');
// 宣告全部資料庫
let todoData = [];
// 預設目前tab在all
let toggleStatus = 'all';
// 宣告分類資料庫
let showData = [];
// 螢幕初始化
updataList();

// 1-1. 新增事項
addBtn.addEventListener('click', addTodo);
function addTodo(e) {
    if (inputContent.value === '') {
        alert('請打些字~~~~~');
        return;
    }
    let todoObj = {
        id: Math.random(),
        content: inputContent.value.trim(),
        isChecked: ''
    }
    todoData.unshift(todoObj);
    // 輸入並送出後,把input設定為空值
    inputContent.value = '';
    updataList();
    initalTab();
    scroll();
    console.log(todoData);
};
// 1-2.Enter做keyup(讓使用者不用一直按addBtn即可送出inputContent.value)
inputContent.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
// 渲染畫面
function render(e) {
    let str = '';
    /*  使用showData來跑forEach原因是因為要用2-2已經篩選好的資料去渲染畫面。
        一開始最原始寫法是用todoData來跑forEach,但這樣呈現的畫面並不會套用2-2已篩選好的資料,
        而是直接把todoData裡面有多少資料就全部直接渲染在畫面,為了防止這樣才需要用showData(已篩選好的資料)來跑forEach    */
    showData.forEach((item) => {
        str += `<li>
                    <label class="checkbox" for="">
                        <input type="checkbox" data-id="${item.id}" ${item.isChecked}/>
                        <span>${item.content}</span>
                    </label>
                    <input type="button" value="×" class="delete" data-id="${item.id}">
                </li>`;
    });
    // 3.更新待辦數字
    let countNum = '';
    let allNum = todoData.length;
    let remainingNum = todoData.filter((item) => item.isChecked === '');
    remainingNum = remainingNum.length;
    if (allNum == 0) {
        str += `<p>請新增一些項目吧^^</p>`
        countNum = `<p>目前沒有待完成項目</p>`
    } else if (remainingNum != 0 && allNum != 0) {
        countNum = `<p>總共有${allNum}個項目,還剩下${remainingNum}個未完成加油♥</p>`
    } else {
        countNum = `<p>恭喜全部完成囉♥</p>`
    }
    listCount.innerHTML = countNum;
    todoList.innerHTML = str;
}
// 2.事項分類
// 2-1.切換tab下面的li屬性
tab.addEventListener('click', changeTab);
function changeTab(e) {
    toggleStatus = e.target.dataset.status;
    tabs.forEach((item) => {
        item.classList.remove('active');
    });
    e.target.classList.add('active');
    updataList();
};
// 2-2.更新代辦清單
function updataList(e) {
    if (toggleStatus === 'all') {
        showData = todoData;
    } else if (toggleStatus === 'work') {
        showData = todoData.filter((item) => item.isChecked == '');
    } else {
        showData = todoData.filter((item) => item.isChecked == 'checked');
    }
    render(showData);
    scroll();
}
// 4.刪除單筆項目 & 切換checked
todoList.addEventListener('click', deleteTodoAndChecked);
function deleteTodoAndChecked(e) {
    let nowId = e.target.dataset.id;
    // 點到delete就做刪除
    if (e.target.getAttribute('class') === 'delete') {
        // 篩選出非點到的nowId(意思是只留下不是點到的id)
        todoData = todoData.filter((item) => item.id != nowId)
        console.log(todoData, nowId, typeof (nowId));
    } else {
        // 點到非delete就做切換checked
        todoData.forEach((item) => {
            if (item.id == nowId) {
                console.log('你點到對的id');
                if (item.isChecked === '') {
                    item.isChecked = 'checked';
                } else {
                    item.isChecked = '';
                }
            }
        });
    }
    updataList();
    scroll();
};
// 5.刪除全部已完成項目
clearAll.addEventListener('click', clear);
function clear(e) {
    e.preventDefault();
    todoData = todoData.filter((item) => item.isChecked == '');
    toggleStatus = 'all';
    updataList();
    initalTab();
    scroll();
}
// 優化: 新增 & 刪除已完成項目的初始化Tab(每次都會跳回data-status = all)
function initalTab(e) {
    tabs.forEach((item) => {
        if (item.dataset.status === 'all') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    })
}
// 優化: tabs切換時新增scroll(add:長度>3 ; remove:長度<3)
function scroll(e) {
    if (showData.length > 3) {
        todoList.classList.add('scroll');
    }else{
        todoList.classList.remove('scroll');
    }
}