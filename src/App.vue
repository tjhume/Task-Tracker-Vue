<template>
  <div id="app">
    <tj-main :today="today" :day="activeDay" :todayTasks="tasks"></tj-main>
    <tj-tabs :today="today" :activeDay="activeDay"></tj-tabs>
    <tj-history :days="allDays"></tj-history>
    <transition name="fade">
        <tj-addtask v-if="addingTask" :tasks="tasks"></tj-addtask>
    </transition>
  </div>
</template>

<script>
// Components
import History from './components/History'
import Tabs from './components/Tabs'
import MainDisplay from './components/MainDisplay'
import AddTask from './components/AddTask'

// Other
import { eventBus } from './main'
import Store from 'electron-store'
var store = new Store();
var today = getDate();

// Set up tasks/history and store
var tasks;
var storeTasks = store.get(today);
var allDays = store.get('days');
if(storeTasks != undefined){
    tasks = storeTasks;
}else{
    tasks = [];
    store.set(today, tasks);
    if(allDays != undefined){
        allDays.push(today);
    }else{
        allDays = [];
        allDays.push(today);
    }
    // The only time we need to set all days (on startup if it is a new day)
    store.set('days', allDays);
}

export default {
    data(){return{
        today: today,
        activeDay: today,
        allDays: allDays,
        tasks: tasks,
        addingTask: false
    }},
    components: {
        'tj-history': History,
        'tj-tabs': Tabs,
        'tj-main': MainDisplay,
        'tj-addtask': AddTask
    },
    created(){
        eventBus.$on('saveTasks', () => {
            store.set(today, this.tasks);
        });
        eventBus.$on('addingTask', () => {
            this.addingTask = true;
        });
        eventBus.$on('stopAdding', () => {
            this.addingTask = false;
        });
        eventBus.$on('setActiveDay', (day) => {
            this.activeDay = day;
        });
        eventBus.$on('copyPrevious', () => {
            if(allDays.length < 2) return;

            for(var i = allDays.length-2; i >= 0; i--){
                var previousTasks = store.get(allDays[i]);
                if(previousTasks != undefined && previousTasks.length > 0){
                    this.tasks = previousTasks;
                    return;
                }
            }
            console.log('No tasks found!');
            return;
        });
    }
}

function getDate(){
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear();
  return output;
}

</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body{
      font-family: 'Open Sans', sans-serif;
      color: #2C2C2C;
      font-size: 16px;
  }
  #app{
    position: fixed;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
  }
  .no-select{
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  h1, h2, h3, h4, h5, h6{
      font-weight: normal;
  }
  .text-center{
      text-align: center;
  }
  .text-right{
      text-align: right;
  }
  .ib{
      display: inline-block;
  }
  .col{
      float: left;
      overflow: hidden;
  }
  .table{
      display: table;
      width: 100%;
      height: 100%;
  }
  .cell-center{
      display: table-cell;
      width: 100%;
      vertical-align: middle;
  }
  .clear{
      clear: both;
  }
  .half{
      width: 50%;
  }
  .third{
      width: 33.33%;
  }
  .fourth{
      width: 25%;
  }
  .fifth{
      width: 20%;
  }
  .fl{
      float: left;
  }
  .fr{
      float: right;
  }
  ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      border-radius: 3px;
  }
  ::-webkit-scrollbar-track {
      background: #ccc;
  }
  ::-webkit-scrollbar-thumb {
      background: #a5a5a5;
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #919191;
  }

    .fade-enter-active,
    .fade-leave-active{
        transition: all 0.5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
        transform: translateY(-10px);
    }
    .fade-move{
        transition: transform 0.5s;
    }
</style>
