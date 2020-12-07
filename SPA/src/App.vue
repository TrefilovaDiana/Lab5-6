//Главный компонент приложения
//template - блок с html разметкой, которая подставится туда, где должен быть компонент на странице
<template>
  <div id="app">
    <header>
      <div class="header-content">
        <h1>Task Manager</h1>
        <nav class="control-panel" v-if="user">
          <button v-on:click="addNewTask" style="margin-right: 30px">Новая задача</button>
          <button v-on:click="exit" style="margin-left: 30px">Выйти</button>
        </nav>
      </div>
    </header>
    <main>
      <aside class="sidebar" v-if="user">
        <h2>Список задач</h2>
        <router-link
                v-for="task in tasks"
                active-class="is-active"
                class="link"
                :to="{ name: 'task', params: { id: task.id } }">
          {{task.id}}. {{task.name}}
        </router-link>
      </aside>
      <div class="content">
        <router-view v-on:deleteTask="delete_task"
                     v-on:startEdit="setup_task_editing"
                     v-on:saveEdit="update_task"
                     v-on:toAuthorizationComponent="open_authorization_component"
                     v-on:toRegistrationComponent="open_registration_component"
                     v-on:onAuthorize="on_authorize"
        >
        </router-view>
      </div>
    </main>

  </div>
</template>

//script - логика скрипта
//axios - Http-клиент, помогает делать запросы к БД
<script>
  import axios from 'axios';
  import Task from "./components/Task.vue";
  import Registration from "./components/Registration.vue";
  import Authorization from "./components/Authorization.vue";

  export default {
	
	//переменные компоненты
    data () {
      return {
        //данные о сервере
        server: 'http://localhost:3000/tasks/', 	//сервер откуда брать задачи
        //данные о задачах
        tasks: [],	//список задач
        //данные об авторизации
        user: undefined	//объект который содежит имя пользователя и пароль пользователя
      }
    },

//действия, при запуске приложения
    created() {
		//открываем компонент авторизации(входа)
      this.open_authorization_component();
    },

//связанные компоненты
    components: {
      Task,
      Registration,
      Authorization
    },

    methods: {
		//открыть компонент авторизации(входа)
      open_authorization_component()
      {
		  //переключение страницы
        this.$router.push({name: "authorization"});
      },

		//включить страницу с регистрацией
      open_registration_component()
      {
        this.$router.push({name: "registration"});
      },

//включить страницу с редактированием задачи(указываем id задачи)
      setup_task_editing(id)
      {
        this.$router.push({name: "edit_task", params: {id: id}});
      },

//событие при входе пользователя
      on_authorize(user)
      {
		  //запоминаем логин и пароль
        this.user = user;
		//получаем список задач пользователя
        this.get_user_tasks();
		//открываем стартовую страницу
        this.open_start_page();
      },

		//функция с действиями когда выходим из под пользователя
      exit()
      {
		  //забываем логин и пароль
        this.user = undefined;
		//открываем страницу с авторизацией
        this.open_authorization_component();
      },

		//открыть стартовую страницу (подкомпонент, где не выбрана ни одна задача)
      open_start_page()
      {
        this.$router.push({name: "home"});
      },

		//добавить новую задачу в БД
      addNewTask()
      {
		  //создаем задачу в памяти (это шаблон пустой задачи)
        const task = {
          name: 'noname',
          description: 'no description',
          complete_status: false,
          owner: this.user.login
        };
		//делаем запрос на сервер с БД и просим вставить созданную задачу
		//post - вставить
        axios.post(this.server, task).
          then(response => {
			  //когда запрос будет исполнен (т.е. задача вставилась), то обновляем список задач на экране
            this.get_user_tasks();
          })
          .catch(error => {
            alert(error);
          })
      },

      delete_task(id)
      {
		  //Делаем запрос на удаление задачи из БД
        axios.delete(this.server + id)
                .then(response => {
					//когда запрос исполнится, то обновляем список
                  this.get_user_tasks();
                })
                .catch( error => {
                  alert(error);
                });
        this.open_start_page();
      },

		//обновить задачу 
		//task - задача с обновленными данными
      update_task(task)
      {
		  //делаем запрос к БД чтобы обновила задачу
        axios.put(this.server + task.id, task)
                .then(response => {
					//когда запрос выполнится, то обновляем список задач
                  this.get_user_tasks();
                })
                .catch(error => {
                  alert(error);
                });
        this.open_start_page();
      },

      get_user_tasks() {
		  //делаем запрос на получение всех задач из БД
        axios.get(this.server)
          .then(response => {
			  //когда придет ответ, то мы фильтруем список и оставляем только те, которые созданы текущим пользователем
            this.tasks = response.data.filter(x => x.owner === this.user.login);
          })
          .catch(error => {
            alert(error);
          })
      },
    }
  }
</script>

// Блок style где описаны стили элементов на странице. Обычный Css
<style lang="scss">

  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'SansSerif', Helvetica, Arial, sans-serif;
    font-size: 18px;
    color: #2c3e50;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  header {
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 90px;
    border-bottom: 1px solid blue;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
  }

  .control-panel
  {
    display: flex;
    flex-direction:row;
  }

  .header-content
  {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  main {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 90px);
    margin-top: 90px;
    overflow: hidden;
  }

  aside {
    height: 100%;
    min-width: 20%;
    padding: 50px 30px;
    border: 1px solid blue;
    flex: 0;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .link {
    display: block;
    text-decoration: none;
    margin-bottom: 10px;
    color: #2c3e50;

    &--home {
      text-transform: uppercase;
      margin-bottom: 30px;
    }

    &.is-active {
      color: #42b983;
    }
  }
</style>
