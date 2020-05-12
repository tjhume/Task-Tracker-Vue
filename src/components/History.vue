<template>
    <div class="history text-center no-select">
        <h2>History</h2>
        <div class="days">
            <div v-for="(day, i) in days"
            :key="i"
            @click="setActiveDay(day)">{{ day }}</div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main'

export default {
    props: ['days'],
    methods: {
        setActiveDay(day){
            eventBus.setActiveDay(day);
        }
    },
    mounted(){
        var container = this.$el.querySelector(".days");
        container.scrollTop = container.scrollHeight;
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
        width: 125px;
        background-color: white;
        color: #2C2C2C;
        margin: 0 auto;
        max-height: 85%;
        overflow-y: auto;
    }
    .days div{
        padding-top: 2px;
        padding-bottom: 2px;
        font-size: 14px;
        cursor: pointer;
        background-color: white;
        transition: all 0.5s;
    }
    .days div:hover{
        opacity: 0.5;
    }
    .days div:nth-child(1){
        padding-top: 4px;
    }
    .days div:nth-last-child(1){
        padding-bottom: 4px;
    }
    .days div:nth-child(even){
        background-color: #f1f1f1;
    }
</style>