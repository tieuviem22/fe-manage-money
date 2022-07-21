<template>
<div class="container">
	<NavbarIntro />
	<div class="screen" style="margin-top:0px ;">
		<div class="screen__content">
			<form class="login">
				<div class="login__field">
					<input type="text" class="login__input" placeholder="User name" v-model="userName">
				</div>
				<div class="login__field">
					<input type="password" class="login__input" placeholder="Password" autocomplete="new-password" v-model="password">
				</div>
				<div class="login__field">
					<input type="password" class="login__input" placeholder="Password Confirm" v-model="rePassword">
				</div>
				<button class="button login__submit" @click.prevent="clickRegister()">
					<span class="button__text">Register</span>
				</button>
				<span style="margin:10px ;cursor: pointer;text-decoration: underline;font-weight: 600;" @click="redirectLogin()">login now </span>				
			</form>
			<div class="social-login">
				<div class="social-icons">
				</div>
                <h3 style="margin-top: 40px;">VNEY</h3>
			</div>
		</div>
		<div class="screen__background">
			<span class="screen__background__shape screen__background__shape4"></span>
			<span class="screen__background__shape screen__background__shape3"></span>		
			<span class="screen__background__shape screen__background__shape2"></span>
			<span class="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavbarIntro from '@/components/common/NavbarIntro.vue';
import ApiService from '@/config/api.service';
import { openNotificationWithIcon } from '@/common';
import router from '@/router';

export default defineComponent({
  name: 'HomeView',
  setup() {
	const userName = ref<string>('')
	const password = ref<string>('')
	const rePassword = ref<string>('')
	const redirectLogin = () => {
		router.push({name : 'login'})
	}
	const clickRegister = () => {
		if(password.value !== rePassword.value) {
			openNotificationWithIcon('error', 're-enter incorrect password!', '')
		}else {
			ApiService.post('/api/auth/register', {
				"username": userName.value,
				"password": password.value
			})
			.then(res => {
				if(res.status == 200) {				
					openNotificationWithIcon('success', res.data.message, '')
					router.push({name : 'login'})
				}else {
					openNotificationWithIcon('error', res.data.message, '')
				}
			})
			.catch(err => {
				openNotificationWithIcon('error', err.response.data.message, '');
			})
		}
	}
	return {
		userName, password, rePassword, clickRegister, redirectLogin
	}
  },
  components: {
	  NavbarIntro
  },
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
.container {
    height: 100vh;
	background: linear-gradient(90deg, #ffffff, #bdbdbd);	
	/* background:linear-gradient(90deg, rgba(255, 255, 255,.3), rgba(189, 189, 189,.1)), url('https://i.pinimg.com/originals/95/35/5b/95355b5ec6edd245b8a4f0c2fd32f8b6.jpg'); */
	background-size: cover;
    box-sizing: border-box;
	margin: 0;
	padding: 0;	
	font-family: Raleway, sans-serif;	
    display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
    overflow: hidden;
}
	
.screen {		
	background: linear-gradient(90deg, rgb(0, 0, 0), #5a5454);		
	position: relative;	
	height: 600px;
	width: 360px;	
	box-shadow: 0px 0px 24px #a1a0a0;
}

.screen__content {
	z-index: 1;
	position: relative;	
	height: 100%;
}

.screen__background {		
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	-webkit-clip-path: inset(0 0 0 0);
	clip-path: inset(0 0 0 0);	
}

.screen__background__shape {
	transform: rotate(45deg);
	position: absolute;
}

.screen__background__shape1 {
	height: 520px;
	width: 520px;
	background: #FFF;	
	top: -50px;
	right: 120px;	
	border-radius: 0 72px 0 0;
}

.screen__background__shape2 {
	height: 220px;
	width: 220px;
	background: rgb(170, 170, 170);	
	top: -172px;
	right: 0;	
	border-radius: 32px;
}

.screen__background__shape3 {
	height: 540px;
	width: 190px;
	background: linear-gradient(270deg, rgba(0, 0, 0,.5), rgb(0, 0, 0));
	top: -24px;
	right: 0;	
	border-radius: 32px;
}

.screen__background__shape4 {
	height: 400px;
	width: 200px;
	background: rgb(170, 170, 170);	
	top: 420px;
	right: 50px;	
	border-radius: 60px;
}

.login {
	width: 320px;
	padding: 30px;
	padding-top: 100px;
}

.login__field {
	padding: 20px 0px;	
	position: relative;	
}

.login__icon {
	position: absolute;
	top: 30px;
	color: black;
}

.login__input {
	border: none;
	border-bottom: 2px solid #b9b9b9;
	background: none;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 75%;
	transition: .2s;
}

.login__input:active,
.login__input:focus,
.login__input:hover {
	outline: none;
	border-bottom-color: rgb(148, 148, 148);
}

.login__submit {
	background: #fff;
	font-size: 14px;
	margin-top: 30px;
	padding: 16px 20px;
	border-radius: 26px;
	border: 1px solid #D4D3E8;
	text-transform: uppercase;
	font-weight: 700;
	display: flex;
	align-items: center;
	width: 100%;
	color: #000000;
	box-shadow: 0px 2px 2px #6e6e6e;
	cursor: pointer;
	transition: .2s;
}

.login__submit:active,
.login__submit:focus,
.login__submit:hover {
	border-color: rgb(113, 113, 113);
	outline: none;
}

.button__icon {
	font-size: 24px;
	margin-left: auto;
	color: black;
}

.social-login {	
	position: absolute;
	height: 140px;
	width: 160px;
	text-align: center;
	bottom: 0px;
	right: 0px;
	color: #fff;
}

.social-icons {
	display: flex;
	align-items: center;
	justify-content: center;
}

.social-login__icon {
	padding: 20px 10px;
	color: #fff;
	text-decoration: none;	
	text-shadow: 0px 0px 8px black;
}

.social-login__icon:hover {
	transform: scale(1.5);	
}
</style>
