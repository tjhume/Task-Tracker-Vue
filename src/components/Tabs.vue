<template>
    <div class="tabs no-select">
        <div class="content">
            <div
            v-for="(day, i) in selectedDays"
            :key="day"
            :class="{active: day==activeDay}"
            @click="setActiveDay(day)">{{ day }}<i v-if="day != today" @click.stop="removeSelectedDay(day, i)" class="fas fa-times"></i></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main.js'

export default {

    data(){return{
        selectedDays: []
    }},
    props: ['activeDay', 'today'],
    methods: {
        setActiveDay(day){
            eventBus.setActiveDay(day);
        },
        removeSelectedDay(day, i){
            var active = false;
            if(day == this.activeDay){
                active = true;
            }

            this.selectedDays.splice(i, 1);

            if(active){
                eventBus.setActiveDay(this.selectedDays[this.selectedDays.length - 1]);
            }
        }
    },
    watch: {
        activeDay(){
            if(this.selectedDays.indexOf(this.activeDay) === -1){
                this.selectedDays.push(this.activeDay);
            }
        }
    },
    created(){
        this.selectedDays.push(this.today);
    }
}
</script>

<style scoped>
    .tabs{
        position: fixed;
        top: 0px;
        bottom: 0px;
        padding-left: 300px;
        width: 100%;
        height: 35px;
    }
    .content{
        height: 100%;
        background-color: #3495D1;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }
    .content>div{
        display: inline-block;
        height: 100%;
        line-height: 35px;
        padding-left: 20px;
        padding-right: 25px;
        font-size: 14px;
        color: white;
        cursor: pointer;
        background-color: #6dafd6;
        position: relative;
        border-right: 1px solid white;
    }
    .content>div:nth-last-child(1){
        border-right: none;
    }
    .content>div.active{
        color: #2C2C2C;
        background-color: white;
        cursor: default;
    }
    .fa-times{
        position: absolute;
        top: 9px;
        right: 8px;
        opacity: 0;
        padding: 2px;
        cursor: pointer;
    }
    .content>div:hover .fa-times{
        opacity: 1;
    }
    .active .fa-times{
        opacity: 1;
    }
</style>