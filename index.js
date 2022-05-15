const app = Vue.createApp({
  data() {
    return {
      // login & register
      emailError: false,
      passwordError: false,
      myListLink: "#",
      // login
      loginEmail: "",
      loginPassword: "",
      // register
      nameError: false,
      againPasswordError: false,
      registerEmail: "",
      registerName: "",
      registerPassword: "",
      registerAgainPassword: "",
    };
  },
  methods: {
    login() {
      if (this.loginEmail === "" && this.loginPassword === "") {
        this.emailError = true;
        this.passwordError = true;
      } else if (this.loginEmail === "") {
        this.emailError = true;
        this.passwordError = false;
      } else if (this.loginPassword === "") {
        this.passwordError = true;
        this.emailError = false;
      } else {
        this.passwordError = false;
        this.emailError = false;
        this.myListLink = "todolist.html";
        console.log("ok");
      }
    },
    register() {
      let email = this.registerEmail;
      let name = this.registerName;
      let password = this.registerPassword;
      let againPassword = this.registerAgainPassword;
      if (
        email === "" ||
        name === "" ||
        password === "" ||
        againPassword === ""
      ) {
        this.emailError = true;
        this.nameError = true;
        this.passwordError = true;
        this.againPasswordError = true;
        if (email !== "") {
          this.emailError = false;
        } else if (name !== "") {
          this.nameError = false;
        } else if (password !== "") {
          this.passwordError = false;
        } else if (againPassword !== "") {
          this.againPasswordError = false;
        }
      } else {
        this.myListLink = "login.html";
        console.log("ok");
      }
    },
  },
});
app.mount("#app");

//研究表單驗證：https://ithelp.ithome.com.tw/articles/10243263
