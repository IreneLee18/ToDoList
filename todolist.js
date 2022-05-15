const app = Vue.createApp({
  data() {
    return {
      currentTab: "全部",
      tabs: ["全部", "待完成", "已完成"],
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
        },
      ],
      selectData: [],
    };
  },
  methods: {
    selectTab(item) {
      this.currentTab = item;
      // console.log(this.currentTab);
    },
    addList() {
      if (this.newTodo === "") {
        return alert("記得輸入一些東西唷！");
      }
      this.allData.unshift({
        value: this.newTodo,
        id: Math.random(),
        isChecked: false,
      });
      this.newTodo = "";
      this.currentTab = "全部";
    },
    deleteList(key) {
      // console.log("click");
      // console.log(key, key.id);
      // 不知為何用這方法會出錯，所以還是改用篩選方式寫
      // this.allData.splice(key, 1);
      this.allData = this.allData.filter((item) => {
        // console.log(item.id);
        return item.id !== key.id;
      });
      this.currentTab = "全部";
    },
    deleteAll() {
      // console.log("done", this.doneData, "clickAll");
      // console.log("all", this.allData, "clickAll");
      this.allData = this.doneData;
      this.currentTab = "全部";
    },
  },
  computed: {
    filterData() {
      if (this.currentTab === "已完成") {
        return (this.selectData = this.allData.filter((item) => {
          return item.isChecked === true;
        }));
      } else if (this.currentTab === "待完成") {
        return (this.selectData = this.allData.filter((item) => {
          return item.isChecked === false;
        }));
      } else {
        return (this.selectData = this.allData);
      }
    },
    workData() {
      return this.allData.filter((item) => {
        return item.isChecked === false;
      });
    },
    doneData() {
      return this.allData.filter((item) => {
        return item.isChecked === false;
      });
    },
  },  
});
app.mount("#app");
