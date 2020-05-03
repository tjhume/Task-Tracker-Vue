<template>
    <div class="history text-center no-select">
        <h2>History</h2>
        <div class="days">
            <div v-for="(task, i) in tasks"
            :key="i"
            @click="setActiveDay(task[0])">{{ task[0] }}</div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main'

export default {
    props: ['tasks'],
    methods: {
        setActiveDay(day){
            eventBus.changeActiveDay(day);
        }
    }
}
</script>

<style scoped>
    .history{
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        width: 300px;
        height: 100%;
        background-color: #3495D1;
        color: white;
        padding: 20px;
    }
    h2{
        margin-bottom: 40px;
    }
    .days{
        width: 175px;
        background-color: white;
        color: #2C2C2C;
        margin: 0 auto;
    }
    .days div{
        padding-top: 2px;
        padding-bottom: 2px;
        font-size: 14px;
        cursor: pointer;
    }
    .days div:nth-child(1){
        padding-top: 4px;
    }
    .days div:nth-last-child(1){
        padding-bottom: 4px;
    }
</style>