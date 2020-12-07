<template lang="html">
  <div class="registration">
    <h2>Регистрация</h2>
    <p>Логин: <input type="text" maxlength="64" v-model="login"></p>
    <p>Пароль: <input type="password" maxlength="64" v-model="password"></p>
    <button v-on:click="validate">Зарегистрироваться</button>
    <button v-on:click="to_authorization_component">Войти</button>
  </div>
</template>

<script>

  import axios from "axios";

  export default {
    data() {
      return {
        login: "",	//введенный логин
        password: "",	//введенный пароль
        endpoint: "http://localhost:3000/users/"     //адрес сервера с БД
      }
    },

    methods:{
      //Валидация данных пользователя
      validate()
      {
        this.login = this.login.trim();
        this.password = this.password.trim();
		//проверяем что логин и пароль не пустые
        if (this.password.length === 0 || this.login.length === 0)
        {
          alert('Пустой логин или пароль');
          return;
        }
		//отправляем запрос, получаем список всех пользователей
        axios.get(this.endpoint)
                .then(response => {
					//когда пользователи пришли
                  if (response.status === 200)
                  {
					  //сораняем список пришедших пользователей
                    const users = response.data;
					//ищем в списке пользователя с таким же логином
					//filter - функция, которая фильтрует список возвращает другой список без лишних значений
                    if (users.filter(x => x.login === this.login).length > 0)
                    {
                      alert('Пользователь с таким логином уже существует');
                      return;
                    }
					//иначе регистрируем нового пользователя
                    else this.register();
                  }
                })
                .catch(error => {
                  alert(error);
                });
      },

      //Регистрация нового пользователя
      register()
      {
		  //формирует объект пользователя
        const new_user = {login: this.login, password: this.password};
		//вставляем его в БД
        axios.post(this.endpoint, new_user)
					//как только пользователь вставился, то говорим главному компоненту, что авторизация прошла успешно.
                .then(response => {
                    this.$emit("onAuthorize", new_user);
                })
                .catch(error => {
                  alert(error);
                })
      },

      to_authorization_component()
      {
        this.$emit("toAuthorizationComponent");
      }
    }
  }
</script>

<style lang="scss">
  .registration {
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
