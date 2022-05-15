# 用ＶＵＥ寫 TO DO LIST ＆ 表單驗證

> 參考範例：
> [Vue To-do List 拆解練習](https://medium.com/ivycodefive/vue-to-do-list-%E6%8B%86%E8%A7%A3%E7%B7%B4%E7%BF%92-8c6f079919e2)
> [自己的CodePen](https://codepen.io/ntjtcxpt-the-animator/pen/mdpeJEj)

## 拆解步驟
1. 新增 List
2. 切換checkbox
3. 刪除 List
4. 全部刪除
5. 事項分類
6. 目前剩下幾個代辦項目



## 1. 新增 List 

+ 流程：
    1. js上定義`newTodo「字串」`，目的是將input所輸入的value放入newTodo中 
    2. js上定義`allData「陣列」`，目的是將newTodo放入allData
    3. 在js綁定方式：`addList()`
        1.  將`value: this.newTodo` `id: Math.random()` `isChecked: false` 使用`push` 方式放入 `allData陣列中`
        2. 最後在寫`this.newTodo = ""`，目的是為了把每新增一次就把字串清空
        3. 記得加入防呆，以防萬一輸入空字串
    4. 在html的form上寫`@submit.prevent="addList"`，且在input上綁定 `v-model.trim="newTodo" ` `:value="newTodo"`，當按下 **enter** or **button type="submit"** 即會送出資料到 addList 上
    5. li使用`v-for="item in allData"` 使資料可以綁定在html畫面上
    

```
data() {
    return {
        newTodo: "",
        allData: [
            {
              value: "測試：未完成",
              id: Math.random(),
              isChecked: false,
            },
            {
              value: "測試：已完成",
              id: Math.random(),
              isChecked: true,
            }
        ],
    };
},
methods: {
    addList() {
        // 避免輸入空字串
        if (this.newTodo === "") {
            return alert("記得輸入一些東西唷！");
        }
        this.allData.push({
            value: this.newTodo, // input所輸入的值
            id: Math.random(),   // 產生亂數(目的：不要有重複id)
            isChecked: false,    // checkbox預設是false
        });
        this.newTodo = "";       // 淨空input
        this.currentTab = "全部"; // 使每新增一次就跳回全部標籤

    },
},
```
```
<form @submit.prevent="addList">
    <input type="text" placeholder="新增待辦事項" 
        v-model.trim="newTodo">
    <button type="submit">
        <img class="me-2" src="image/plus 1.png" alt="plus">
    </button>
</form>

<li v-for="item in allData" :key="item.id">
    <label class="checkbox" :for="item.id">
        <input class="check" type="checkbox" :id="item.id" 
            v-model="item.isChecked">
                         
        // 如果要套用unclick，isChecked要是false，且要將false反轉才會套用
        <span :class="{'unclick':!item.isChecked}"></span>

        // 如果要套用clicked，isChecked要是true
        <span :class="{'clicked':item.isChecked}"></span>
        
        <span :class="{'checked':item.isChecked}">{{ item.value }}</span>
        <input :id="item.id" type="button" value="×">
    </label>
</li>
```

## 2. 切換checkbox
+ 流程：程式碼如同 `新增List` 的，且從第五點開始一起看
    1. 在label上綁定`:for="item.id"`，且在input上也綁定`:id="item.id"`，目的是為了讓 label & input 做互相對應
    2. input綁定`v-model="item.isChecked"`，目的是為了將 **isChecke** 做雙向綁定
    3. 使v-bind綁定css樣式，但因為 `樣式:true` 才會套用，所以要將unclick的false反轉才行（詳細請看上面程式碼註解，但解釋的有點饒舌）
    
    
## 3. 刪除 List
+ 流程：
    1. 在js綁定方式 `deleteList(目前所點到的)`：全部資料＝全部資料去篩選出，全部資料的id != 目前所點到的id (用排除方式寫：留下不是目前點到的，刪除目前所點到的)
    2. html綁定 `@click="deleteList(item)"`
     

```
deleteList(key) {
      // 不知為何用這方法會出錯，所以還是改用篩選方式寫
      // this.allData.splice(key, 1);
      
      this.allData = this.allData.filter((item) => {
        console.log(item.id)
        return item.id !== key.id;
      });
      this.currentTab = "全部";
    },
```
```
<li v-for="item in allData" :key="item.id">
    <label class="checkbox" :for="item.id">
        ...
        <input :id="item.id" class="cancel" type="button" value="×" 
        @click="deleteList(item)">
    </label>
</li>
```
## 4. 全部刪除
+ 流程：
    1. 使用computed讀取doneData
    2. 將全部資料去篩選出 isChecked === false `因為要將非完成List放入到完成陣列中`
    3. js綁定方式：`deleteAll()` 當全部資料 ＝ doneData
    4. 在html上綁定 `@click="deleteAll"`
       
```
methods: {
    deleteAll() {
        
        // 將尚未完成的List放入到全部資料中(用排除法方式：留下非完成，刪掉已完成)
        this.allData = this.doneData;
        
        // 每按一次就跳回 全部 標籤上
        this.currentTab = "全部";
    },
},
computed: {
    doneData() {
        return this.allData.filter((item) => {
        
            // 要取出尚未完成的List
            return item.isChecked === false;
        });
    },
},
```
```
<div>
    ...
    <p v-if="workData.length !==0">{{workData.length}} 個待完成項目</p>
    <a href="#" class="text-dark" @click="deleteAll">清除已完成項目</a>
</div>
```
## 5. 事項分類

1. 切換上方Tabs
+ 流程：
    1. 先在js上定義好currentTab(預設值是**全部**) 
    2. 把tab標籤名稱放入 js data 中（使用陣列方式）
    3. 在html上使用 `v-for="tab in tabs" :key="tab"` ，讓標籤綁定在html上，並加上 `{{ tab }}` 使標籤可以顯示在畫面
    4. 在js綁定方式：`selectTab(item) { this.currentTab = item; }`
    5. 在html上綁定 `@click="selectTab(tab)` ，使目前點到的tab可以放入步驟四的`this.currentTab`上
    6. 再加上 `:class="{'tab-active':currentTab===tab}` ，當 `currentTab===tab` 就套用 `tab-active` 樣式
```
data() {
    return {
      currentTab: "全部",
      tabs: ["全部", "待完成", "已完成"],
    };
},
methods: {
    selectTab(item) {
      this.currentTab = item;
    },
},
```
```
<ul class="text-center d-flex list-unstyled mb-0 text-dark fw-bold">
    <li class="tab w-100 pb-3 border-bottom border-2" 
        :class="{'tab-active':currentTab===tab}"
        v-for="tab in tabs" :key="tab"
        @click="selectTab(tab)"
        >{{ tab }}
    </li>
</ul>
```
2. 切換tabs & 下方的事項
+ 流程：
    1. 使用computed做讀取內容
       > computed：把data的內容讀取出來→重新運算一個新的結果→再渲染到畫面上
       > p.s. computed 一定要寫 **return** 才會回傳到畫面上
    2. 把原本的`v-for="item in allData" ` 改成 `v-for="item in filterData"`

```
data() {
    return {
        ...
        selectData: [], // 存放篩選的資料
    };
},
computed: {
    filterData() {
    
      // 如果 currentTab === "已完成"，將全部資料做篩選，選出 isChecked === true ，並放入 selectData 中
      if (this.currentTab === "已完成") {
        return (this.selectData = this.allData.filter((item) => {
          return item.isChecked === true;
        }));
        
        // 如果 currentTab === "待完成"，將全部資料做篩選，選出 isChecked === false ，並放入 selectData 中
      } else if (this.currentTab === "待完成") {
        return (this.selectData = this.allData.filter((item) => {
          return item.isChecked === false;
        }));
        
        // 如果 currentTab !== 以上的（意思就是currentTab === "全部"），將全部資料 放入 selectData 中
      } else {
        return (this.selectData = this.allData);
      }
    },
},
```
```
原本：
<li v-for="item in allData" :key="item.id">
    ...
</li>

改成：
<li v-for="item in filterData" :key="item.id">
    ...
</li>
```
## 6. 目前剩下幾個代辦項目 
+ 流程：
    1. 使用computed做讀取內容
    2. 將全部資料做篩選，選出 isChecked === false
    3. 再將篩選出來的資料長度，放入 html 畫面上
    4. 如果`workData.length !==0"`則套用第一個，若`workData.length ===0"`則套用第二個

```
computed: {
    workData() {
        return this.allData.filter((item) => {
            return item.isChecked === false;
        });
    },
}
```
```
// 第一個
<p v-if="workData.length !==0">{{workData.length}} 個待完成項目</p> 

// 第二個
<p v-if="workData.length ===0">恭喜全部已完成！</p>
```

## 理解
1.submit要用form(不懂用背的ＱＱ)
> 參考文件：
> [vue.js](https://v3.cn.vuejs.org/api/directives.html#v-on)
> [Vue.js Core 30天屠龍記(第16天): 事件處理](https://ithelp.ithome.com.tw/articles/10206798)

## 表單驗證
+ 流程：
    1. js綁定方式：`login()`
```
data() {
    return {
        emailError: false,
        passwordError: false,
        myListLink:'#',
        loginInputValue: {},
        loginEmail: "",
        loginPassword: "",       
    },
methods: {
    login() {
        if (this.loginEmail === "" && this.loginPassword === "") {
            this.emailError = true;
            this.passwordError = true;
        } else if (this.loginEmail ==="") {
            this.emailError = true;
            this.passwordError=false
        } else if (this.loginPassword ==="") {
            this.passwordError = true;
            this.emailError = false;
        } else{
            this.myListLink="todolist.html"
        }
    },
},
```
```
<div class="input-group-lg">
    <label for="Email">
    Email
    </label>
        <input v-model="loginEmail" placeholder="請輸入Email" id="Email" type="email">
        <div class="invalid-feedback" :class="{'d-block':emailError}">請輸入正確格式</div>
</div>
<div class="input-group-lg">
    <label for="password">
    密碼
    </label>
        <input v-model="loginPassword" placeholder="請輸入密碼" id="password" type="password">
        <div class="invalid-feedback" :class="{'d-block':passwordError}">此欄位不得為空</div>
</div>

<div>
    <a :href="myListLink" type="submit" class="btn btn-secondary my-3" @click="login">登入</a>
    <a href="register.html" class="text-center fw-normal">註冊帳號</a>
</div>
```

> [表單驗證，正規表達](https://hackmd.io/@FortesHuang/rJf6CYynS#Email%E9%A9%97%E8%AD%89%E7%9A%84%E8%A4%87%E9%9B%9C%E6%80%A7)
> 

