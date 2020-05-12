<template>
    <div @mousedown="cancel" class="add-task">
        <div class="table">
            <div class="cell-center">
                <div class="add-box" @mousedown.stop :class="type">
                    <i @click="cancel" class="fas fa-times"></i>
                    <h2 class="text-center no-select">Add Task</h2>
                    <form @input="error = ''">
                        <div class="form-group">
                            <label for="tasktype">Task Type</label>
                            <select id="tasktype" class="form-control" v-model="type">
                                <option value="">Select task type</option>
                                <option value="simple">Simple</option>
                                <option value="timed">Timed</option>
                            </select>
                        </div>
                        <transition name="fade">
                            <div v-if="type!=''">
                                <div class="form-group">
                                    <label for="taskname">Task Name</label>
                                    <input id="taskname" type="text" class="form-control" v-model="name">
                                </div>
                                <div class="error" v-if="error!=''">{{ error }}</div>
                                <button v-if="type == 'simple'" type="submit" class="btn btn-primary" @click.prevent="addTask">Submit</button>
                            </div>
                        </transition>
                        <transition name="fade">
                            <div v-if="type=='timed'">
                                <div class="form-group">
                                    <label for="hours">Hours</label>
                                    <input @input="validateHours" @paste.prevent @keypress="noDecimals" class="form-control" id="hours" type="number" v-model="hours">
                                </div>
                                <div class="form-group">
                                    <label for="minutes">Minutes</label>
                                    <input @input="validateMinutes" @paste.prevent @keypress="noDecimals" class="form-control" id="minutes" type="number" v-model="minutes">
                                </div>
                                <div class="form-group">
                                    <label for="seconds">Seconds</label>
                                    <input @input="validateSeconds" @paste.prevent @keypress="noDecimals" class="form-control" id="seconds" type="number" v-model="seconds">
                                </div>
                                <div class="error" v-if="error!=''">{{ error }}</div>
                                <button type="submit" class="btn btn-primary" @click.prevent="addTask">Submit</button>
                            </div>
                        </transition>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main'

export default {
    data(){return{
        type: '',
        name: '',
        hours: 0,
        minutes: 0,
        seconds: 0,
        error: ''
    }},
    props: ['tasks'],
    methods: {
        addTask(){
            for(var i = 0; i < this.tasks.length; i++){
                if(this.name == this.tasks[i].name){
                    this.error = '*That task name is already in use'
                    return;
                }
            }
            if(this.type=='simple'){
                if(this.name == ''){
                    this.error = '*Please enter a value for the task name';
                    return;
                }
                let newTask = {
                    name: this.name,
                    type: 'simple',
                    status: 'unchecked'
                };
                this.tasks.push(newTask);
                eventBus.saveTasks();
                eventBus.stopAdding();
            }else if(this.type=='timed'){
                if(this.name == ''){
                    this.error = '*Please enter a value for the task name';
                    return;
                }
                if(!(this.hours > 0) && !(this.minutes > 0) && !(this.seconds > 0)){
                    this.error = '*A timed task cannot have 0 duration';
                    return;
                }
                var seconds = this.hours*3600 + this.minutes*60 + this.seconds;
                let newTask = {
                    name: this.name,
                    type: 'timed',
                    timeRemaining: seconds,
                    totaltime: seconds
                };
                this.tasks.push(newTask);
                eventBus.saveTasks();
                eventBus.stopAdding();
            }
        },
        validateHours(){
            if(this.hours > 23)
                this.hours = 23;
            else if(this.hours < 0)
                this.hours = 0;
            else
                this.hours = Math.floor(this.hours);
        },
        validateMinutes(){
            if(this.minutes > 59)
                this.minutes = 59;
            else if(this.minutes < 0)
                this.minutes = 0;
            else
                this.minutes = Math.floor(this.minutes);
        },
        validateSeconds(){
            if(this.seconds > 59)
                this.seconds = 59;
            else if(this.minutes < 0)
                this.seconds = 0;
            else
                this.seconds = Math.floor(this.seconds);
        },
        noDecimals(e){
            if(e.charCode == 46)
                e.preventDefault();
        },
        cancel(){
            eventBus.stopAdding();
        }
    },
    created(){
        window.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                eventBus.stopAdding();
            }
        });
    }
}
</script>

<style scoped>
    .add-task{
        position: fixed;
        top: 0px;
        bottom: 0px;
        width: 100%;
        height: 101%;
        overflow-y: hidden;
        background-color: rgba(0, 0, 0, 0.3);
    }
    .fa-times{
        padding: 2px;
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }
    .add-box{
        width: 90%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #3495D1;
        color: white;
        padding: 20px;
        position: relative;
        height: 180px;
        transition: height .5s;
        overflow: hidden;
    }
    .add-box.simple{
        height: 288px;
    }
    .add-box.timed{
        height: 516px;
    }
    h2{
        margin-bottom: 30px;
    }
    label{
        font-weight: normal;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .btn-primary{
        background-color: #6dafd6;
        border: none;
    }
    .btn-primary:hover{
        opacity: 0.8;
    }
    .error{
        font-size: 14px;
        margin-bottom: 10px;
        font-style: italic;
    }
</style>