<template>
    <div class="main-display">
        <div class="content text-center">
            <transition name="fade" mode="out-in">
                <h2 :key="day">{{ day }}</h2>
            </transition>
            <ul v-if="tasks.length > 0" :style="{height: tasks.length*30 + 'px'}">
                <draggable v-model="tasks" draggable=".today">
                    <transition-group tag="div" name="slide">
                        <li v-for="(task, i) in tasks" :key="task.name" :class="{disabled: tracking != '' && tracking != task.name, today: isToday}">
                            <div class="col half">{{ task.name }}</div>
                            <div v-if="task.type=='timed'" class="col half text-right">
                                <i v-if="tracking == task.name" class="fas fa-pause" @click="stopTracking(task)"></i>
                                <i v-else-if="!isToday && task.timeRemaining != 0" class="fas fa-times failed"></i>
                                <i v-else-if="task.timeRemaining == 0" class="fas fa-check"></i>
                                <i v-else-if="isToday" class="fas fa-play" @click="track(task)"></i>
                                <span class="timer">{{ timeStr(task.timeRemaining) }}</span>
                                <i v-if="isToday" @click="remove(i)" class="fas fa-times"></i>
                                <i v-else style="padding-left: 14px; margin-left: 10px;"></i>
                            </div>
                            <div v-else-if="task.type='simple'" class="col half text-right">
                                <i v-if="task.status=='unchecked' && isToday" @click="check(task)" class="far fa-square"></i>
                                <i v-else-if="task.status=='unchecked' && !isToday" class="fas fa-times failed"></i>
                                <i v-else class="fas fa-check"></i>
                                <i v-if="isToday" @click="remove(i)" class="fas fa-times"></i>
                            </div>
                            <div class="clear"></div>
                        </li>
                    </transition-group>
                </draggable>
            </ul>
            <h3 v-else>No tasks found</h3>
            <transition name="fade">
                <div v-if="isToday" class="add-task button" @click="addClicked">Add Task<i class="fas fa-plus"></i></div>
            </transition>
            <transition name="fade">
                <div v-if="isToday && tasks.length == 0" @click.stop="copyPrevious" class="button">Copy From Last Day<i class="fas fa-plus"></i></div>
            </transition>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main'
import Store from 'electron-store'
import draggable from 'vuedraggable'
var store = new Store();
var cachedTasks = [];

export default {
    data(){return{
        tracking: ''
    }},
    // Day is the active day
    props: ['day', 'todayTasks', 'today'],
    computed: {
        tasks: {
            get(){
                if(this.day == this.today){
                    return this.todayTasks;
                }
                for(var i = 0; i < cachedTasks.length; i++){
                    if(cachedTasks[i][0] == this.day){
                        return cachedTasks[i][1];
                    }
                }
                var newTasks = store.get(this.day);
                cachedTasks.push([this.day, newTasks]);
                return newTasks;
            },
            set(newVal){
                eventBus.reOrder(newVal);
            }
        },
        isToday(){
            return (this.day == this.today);
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
        copyPrevious(){
            eventBus.copyPrevious();
        }
    },
    components: {
        'draggable': draggable
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
    .col{
        white-space: nowrap;
        overflow-x: auto;
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
        transition: height 0.5s;
    }
    li{
        padding: 5px 10px;
        font-size: 14px;
        position: relative;
        background-color: white;
        transition: all .5s;
        height: 30px;
    }
    li.disabled{
        opacity: 0.5;
        pointer-events: none;
    }
    li:nth-child(odd){
        background-color: #f1f1f1;
        transition: all .5s;
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
    .fa-times.failed{
        opacity: 1;
        color: red;
        cursor: default;
        position: absolute;
        top: 7px;
        right: 110px;
        margin-left: 0px;
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
    .slide-enter{
        opacity: 0;
    }
    .slide-enter-active{
        animation: slide-in .5s ease-out forwards;
    }
    .slide-leave-active{
        animation: slide-out .5s ease-out forwards;
        opacity: 0;
        position: absolute;
        width: 100%;
    }
    .slide-move{
        transition: transform .5s;
    }

    @keyframes slide-in{
        from{
            transform: translateY(20px);
        }
        to{
            transform: translateY(0px);
        }
    }
    @keyframes slide-out{
        from{
            transform: translateY(0px);
        }
        to{
            transform: translateY(20px);
        }
    }
</style>