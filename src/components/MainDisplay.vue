<template>
    <div class="main-display">
        <div class="content text-center">
            <h2>{{ day }}</h2>
            <ul v-if="tasks.length">
                <li v-for="(task, i) in tasks" :key="i" :class="{disabled: tracking != '' && tracking != task.name}">
                    <div class="col half">{{ task.name }}</div>
                    <div v-if="task.type=='timed'" class="col half text-right">
                        <i v-if="tracking == task.name" class="fas fa-pause" @click="stopTracking(task)"></i>
                        <i v-else-if="task.timeRemaining == 0" class="fas fa-check"></i>
                        <i v-else class="fas fa-play" @click="track(task)"></i>
                        <span class="timer">{{ timeStr(task.timeRemaining) }}</span>
                        <i @click="remove(i)" class="fas fa-times"></i>
                    </div>
                    <div v-else-if="task.type='simple'" class="col half text-right">
                        <i v-if="task.status=='unchecked'" @click="check(task)" class="far fa-square"></i>
                        <i v-else class="fas fa-check"></i>
                        <i @click="remove(i)" class="fas fa-times"></i>
                    </div>
                    <div class="clear"></div>
                </li>
            </ul>
            <h3 v-if="tasks.length == 0">No tasks found</h3>
            <div class="add-task button" @click="addClicked">Add Task<i class="fas fa-plus"></i></div>
            <div v-if="yesterdayAlert != '' && tasks.length == 0" class="yesterday-alert">{{ yesterdayAlert }}</div>
            <div v-if="tasks.length == 0 && allTasks.length > 1" @click="copyYesterday" class="button">Copy Yesterday's Tasks<i class="fas fa-plus"></i></div>
        </div>
    </div>
</template>

<script>

import { eventBus } from '../main'

export default {
    data(){return{
        tracking: ''
    }},
    props: ['day', 'allTasks', 'yesterdayAlert'],
    computed: {
        tasks() {
            for(var i = 0; i < this.allTasks.length; i++){
                if(this.allTasks[i][0] == this.day){
                    return this.allTasks[i][1];
                }
            }
            return null;
        }
    },
    methods: {
        track(task){
            this.tracking = task.name;
            var vm = this;
            task.interval = setInterval(function(){
                if(task.timeRemaining == 1){
                    task.timeRemaining -= 1;
                    vm.stopTracking(task);
                    eventBus.saveTasks();
                }else{
                    task.timeRemaining -= 1;
                    if(task.timeRemaining%10 == 0) eventBus.saveTasks();
                }
            }, 1000)
        },
        stopTracking(task){
            this.tracking = '';
            clearInterval(task.interval);
        },
        timeStr(seconds){
            var hours = Math.floor(seconds / 3600);
            if(hours < 10)
                hours = "0" + hours;
            seconds %= 3600;
            var minutes = Math.floor(seconds / 60);
            if(minutes < 10)
                minutes = "0" + minutes;
            var s = seconds % 60;
            if(s < 10)
                s = "0" + s;    
            return hours + ':' + minutes + ':' + s;
        },
        check(task){
            task.status = 'checked';
            eventBus.saveTasks();
        },
        remove(i){
            this.tasks.splice(i, 1);
            eventBus.saveTasks();
        },
        addClicked(){
            eventBus.addingTask();
        },
        copyYesterday(){
            eventBus.copyYesterday();
        }
    }
}
</script>

<style scoped>
    .main-display{
        position: fixed;
        top: 0px;
        bottom: 0px;
        width: 100%;
        height: 100%;
        padding-left: 300px;
        padding-top: 35px;
    }
    .content{
        background-color: white;
        height: 100%;
        padding-top: 40px;
        overflow-y: auto;
    }
    h3{
        margin-top: 40px;
    }
    ul{
        margin-top: 40px;
        text-align: left;
        width: 90%;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        list-style-type: none;
        padding: 0px;
    }
    li{
        padding: 5px 20px;
        font-size: 14px;
        position: relative;
    }
    li.disabled{
        opacity: 0.5;
        pointer-events: none;
    }
    li:nth-child(odd){
        background-color: #f1f1f1;
    }
    span{
        display: inline-block;
    }
    .fa-times{
        opacity: 0;
        cursor: pointer;
        padding: 2px;
        margin-left: 10px;
    }
    .fa-play,
    .fa-pause,
    .fa-square{
        cursor: pointer;
        padding: 2px;
        position: absolute;
        top: 7px;
        right: 110px;
    }
    .fa-check{
        padding: 2px;
        color: green;
        text-shadow: 0px 0px 1px black;
        position: absolute;
        top: 7px;
        right: 110px;
    }
    li:hover .fa-times{
        opacity: 1;
    }
    .timer{
        margin-left: 10px;
    }
    .add-task{
        margin-top: 40px;
        margin-bottom: 20px;
    }
    .button{
        background-color: #3495D1;
        width: 300px;
        margin-left: auto;
        margin-right: auto;
        color: white;
        padding: 10px 0px;
        position: relative;
        cursor: pointer;
    }
    .button i{
        position: absolute;
        top: 12px;
        right: 15px;
    }
    .button:hover{
        opacity: 0.8;
    }
    .yesterday-alert{
        font-style: italic;
        margin-top: 20px;
        margin-bottom: 5px;
        font-size: 14px;
    }
</style>