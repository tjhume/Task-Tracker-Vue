<template>
  <div id="app">
    <tj-main :day="activeDay" :allTasks="tasks" :addingTask="addingTask" :yesterdayAlert="yesterdayAlert"></tj-main>
    <tj-tabs :tasks="tasks" :selectedDays="selectedDays" :activeDay="activeDay" :today="today"></tj-tabs>
    <tj-history :tasks="tasks"></tj-history>
    <tj-addtask v-if="addingTask" :day="activeDay"></tj-addtask>
  </div>
</template>

<script>
import History from './components/History'
import Tabs from './components/Tabs'
import MainDisplay from './components/MainDisplay'
import AddTask from './components/AddTask'
import { eventBus } from './main'
import Store from 'electron-store'
var store = new Store();
var today = getDate();
var yesterday = getYesterday();

var tasks;
var storeTasks = store.get('tasks');
if(storeTasks != undefined){
    tasks = [...storeTasks];
}else{
    tasks = [
        [today, []]
    ]
}

export default {
    data(){return{
        selectedDays: [today],
        activeDay: today,
        today: today,
        yesterday: yesterday,
        tasks: tasks,
        addingTask: false,
        yesterdayAlert: ''
    }},
    components: {
        'tj-history': History,
        'tj-tabs': Tabs,
        'tj-main': MainDisplay,
        'tj-addtask': AddTask
    },
    computed: {
        activeIndex(){
            for(var i = 0; i < this.tasks.length; i++){
                if(this.activeDay == this.tasks[i][0]) return i;
            }
            return 0;
        }
    },
    created(){
        eventBus.$on('setActiveDay', (day) => {
            if(this.selectedDays.indexOf(day) === -1)
                this.selectedDays.push(day);
            this.activeDay = day;
        });
        eventBus.$on('removeSelectedDay', (day) =>{
            for(var i = 0; i < this.selectedDays.length; i++){
                if(this.selectedDays[i] == day){
                    this.$delete(this.selectedDays, i);
                    break;
                }
            }
            if(this.activeDay == day)
                this.activeDay = this.selectedDays[this.selectedDays.length - 1];
        });
        eventBus.$on('addingTask', () =>{
            this.addingTask = true;
        });
        eventBus.$on('addTask', (task) =>{
            this.tasks[this.activeIndex][1].push(task);
            store.set('tasks', this.tasks);
            this.addingTask = false;
            return;
        }),
        eventBus.$on('cancelAdd', () =>{
            this.addingTask = false;
        });
        eventBus.$on('copyYesterday', () =>{
            for(var i = 0; i < this.tasks.length; i++){
                if(this.yesterday == this.tasks[i][0]){
                    this.tasks[i+1][1] = [...this.tasks[i][i]];
                    store.set('tasks', this.tasks);
                    return;
                }
            }
            this.yesterdayAlert = 'No tasks found for yesterday';
        });
        eventBus.$on('saveTasks', () =>{
            store.set('tasks', this.tasks);
        })
    }
}

function getDate(){
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear();
    return output;
}

function getYesterday(){
    var d = new Date();
    d.setDate(d.getDate() - 1);
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
      background: transparent;
  }
  ::-webkit-scrollbar-thumb {
      background: #bbb;
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #aaa;
  }

</style>
