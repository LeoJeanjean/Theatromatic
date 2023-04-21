<template>


  <div class="containter-login-form">

    <div class="panel panel-default ">
    
    <div class="panel-body">  
      <label class="switch">
        <input type="checkbox" @click="toggleCheckbox">
        <div class="slider round"></div>
      </label>

    </div>
  </div>

    <form class="login-form" action="javascript:void(0);" v-if="this.checkbox">
      <h1>Login</h1>
      <div class="form-input-material">
        <label for="username">Nom</label>
        <input type="text" name="username" id="username" placeholder=" " autocomplete="off" class="form-control-material" required v-model="nameLogin"/>
      </div>
      <div class="form-input-material">
        <label for="password">Mot de passe</label>
        <input type="password" name="password" id="password" placeholder=" " autocomplete="off" class="form-control-material" required v-model="passwordLogin" />
      </div>
      <button type="submit" class="btn btn-primary btn-ghost" @click="login()">Se connecter</button>
    </form>

    <form class="signup-form" ref="signupFormRef" action="javascript:void(0);" v-else>
      <h1>Signup</h1>
      <div class="form-input-material">
        <label for="username">Nom</label>
        <input type="text" name="usernameRegister" id="usernameRegister" placeholder=" " autocomplete="off" class="form-control-material" required v-model="nameSignup"/>
      </div>
      <div class="form-input-material">
        <label for="username">Email</label>
        <input type="text" name="username" id="username" placeholder=" " autocomplete="off" class="form-control-material" required v-model="email"/>
      </div>
      <div class="form-input-material">
        <label for="password">Mot de passe</label>
        <input type="password" name="passwordRegister" id="passwordRegister" placeholder=" " autocomplete="off" class="form-control-material" required v-model="passwordSignup"/>
      </div>
      <button type="submit" class="btn btn-primary btn-ghost" @click="signup()">S'inscrire</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import User from "../models/User";
import useUserStore from "../stores/user";
import { mapActions, mapState } from 'pinia'


  export default {
     
    data() {
      return {
        checkbox: false,
        nameLogin : "",
        email: "",
        passwordLogin: "",
        nameSignup: "",
        passwordSignup: ""
      }
    },
    methods: {
      ...mapActions(useUserStore, ['updateUserDatas']),
      ...mapActions(useUserStore, ['getUserDatas']),
      send() {
        this.$emit('send', 'Hello World');
      },
      toggleCheckbox() {
        this.checkbox = !this.checkbox
        this.$emit('setCheckboxVal', this.checkbox)
      },
    async signup() {
      if (this.nameSignup == "" || this.email == "" || this.passwordSignup == "") {
        console.log("all fields required");
        return;
      }
      let newUser = new User(this.nameSignup, this.email, this.passwordSignup)
      const response = await axios.post(
        'http://localhost:3000/signup',
        {
          user: newUser
        },
      
      ).then((response) => {
        console.log(response);
        this.$refs.signupFormRef.reset();
        
      })
    },
    async login() {
      let userInfos = {"name" : this.nameLogin, "password": this.passwordLogin }
      const response = await axios.post(
        'http://localhost:3000/login',
        {
          userInput: userInfos
        },
      ).then((response) => {
        console.log(response.data);
        this.updateUserDatas(response.data);
        localStorage.setItem("user", JSON.stringify(response.data))
        console.log(this.userDatas);
        console.log(response.data);
        if (response.data !== false) {
          this.$router.push('/');
          this.$emit('send', true);
        } else {
          console.log("toast :mauvais identifiant");
        }
      })
    }
    }, 
    computed: {
      ...mapState(useUserStore, ['userDatas'])

    },
    mounted() {
      if (localStorage.getItem("user") !== null) {
        this.$router.push("/")
      }
    }
  }

</script>

<style>


.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #101010;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.containter-login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #eceffc;
}

.btn {
  padding: 8px 20px;
  border-radius: 0;
  overflow: hidden;
}


.form-input-material input {
  color: rgb(0, 0, 0);
}

.login-form, .signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 40px;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 0.4px 0.4px rgba(128, 128, 128, 0.109), 0 1px 1px rgba(128, 128, 128, 0.155), 0 2.1px 2.1px rgba(128, 128, 128, 0.195), 0 4.4px 4.4px rgba(128, 128, 128, 0.241), 0 12px 12px rgba(128, 128, 128, 0.35);
}
.login-form h1, .signup-form h1 {
  margin: 0 0 24px 0;
}
.login-form .form-input-material {
  margin: 12px 0;
}

.signup-form .form-input-material {
  margin: 12px 0;
}
.login-form .btn {
  width: 100%;
  margin: 18px 0 9px 0;
}

</style>
