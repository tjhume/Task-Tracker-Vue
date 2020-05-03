<template>
    <div class="tabs no-select">
        <div class="content">
            <div
            v-for="(day, i) in selectedDays"
            :key="i"
            :class="{active: day==activeDay}"
            @click="setActiveDay(day)">{{ day }}<i v-if="day != today" @click.stop="removeSelectedDay(day)" class="fas fa-times"></i></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main'

export default {
    props: ['selectedDays', 'activeDay', 'today'],
    methods: {
        setActiveDay(day){
            eventBus.changeActiveDay(day);
        },
        removeSelectedDay(day){
            eventBus.removeSelectedDay(day);
        }
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