import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'

import Task from './components/Task.vue'
import Hello from './components/Hello.vue'
import TaskEditing from "./components/TaskEditing.vue";
import Registration from "./components/Registration.vue";
import Authorization from "./components/Authorization.vue";

Vue.use(Router);
//router - переключатель страниц сайта
const router = new Router({
	//список возможных страниц сайта
 routes: [
    {
     path: '/home',   //путь в адресной строке который показывается, когда страница запущена
     name:'home',		//название страницы
     component: Hello,	//компонент страницы
    },
    {//страница задачи
     path: '/task/:id', 
     name:'task',
     component: Task,
     props: true,	     //props(properties) - флаг обозначающий, что для запуска этой страницы нужны какие-то параметры
    },
    {//страница редактирования задачи
         path: '/edit_task/:id',
        name: 'edit_task',
        component: TaskEditing,
        props: true,
    },
     {//страница регистрации пользователя
         path: '/registration',
         name: 'registration',
         component: Registration
     },
     {//страница авторизации пользователя
         path: '/authorization',
         name: 'authorization',
         component: Authorization
     },
 ]
});

//запуск механизма показа сайта
new Vue({
 el: '#app',
 render: h => h(App),
 router
});