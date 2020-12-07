<template lang="html">
  <div class="enter">
    <h2>Вход</h2>
    <p>Логин: <input type="text" maxlength="64" v-model="login"></p>
    <p>Пароль: <input type="password" maxlength="64" v-model="password"></p>
    <button v-on:click="authorize">Войти</button>
    <button v-on:click="to_registration_window">Зарегистрироваться</button>
  </div>
</template>

<script>

  import axios from "axios";

  export default {
    data() {
      return {
        login: "",//строка с логином
        password: "",	//строка с паролем
        endpoint: "http://localhost:3000/users/"  //адрес сервера с БД
      }
    },

    methods:{
		//действие когда нажали на кнопку авторизоваться
      authorize()
      {
		 //получаем список всех зарегистрированных пользователей 
        axios.get(this.endpoint)
                .then(response => {
					//когда все пользователи пришли, то
					//фильтруем всех пользователей и отбираем тех, у кого такой же логин и пароль, как мы ввели
                  const users = response.data.filter(x => x.login === this.login && x.password === this.password);
				  //если таких пользователей нет, то пользователя нет
                  if (users.length === 0)
                  {
                    alert('Нет такого пользователя');
                  }
                  else //если пользователи есть, то берем первого и заходим из-под него.
					//говорим главному компоненту что авторизация прошла успешно и передаем данные пользователя
                    this.$emit("onAuthorize", users[0]);
                })
                .catch(error => {
                  alert(error);
                })
      },

      to_registration_window()
      {
        this.$emit("toRegistrationComponent");
      }
    },
  }
</script>

<style lang="scss">
  .enter {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }

  button{
    margin: 5px 5px;
  }
</style>
