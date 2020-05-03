import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

export const eventBus = new Vue({
  methods: {
    changeActiveDay(day){
      this.$emit('setActiveDay', day);
    },
    removeSelectedDay(day){
      this.$emit('removeSelectedDay', day);
    },
    addingTask(){
      this.$emit('addingTask');
    },
    addTask(task){
      this.$emit('addTask', task);
    },
    cancelAdd(){
      this.$emit('cancelAdd');
    },
    copyYesterday(){
      this.$emit('copyYesterday');
    },
    saveTasks(){
      this.$emit('saveTasks');
    }
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
