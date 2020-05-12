import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

export const eventBus = new Vue({
  methods: {
    saveTasks(){
      this.$emit('saveTasks');
    },
    addingTask(){
      this.$emit('addingTask');
    },
    stopAdding(){
      this.$emit('stopAdding');
    },
    setActiveDay(day){
      this.$emit('setActiveDay', day);
    },
    copyPrevious(){
      this.$emit('copyPrevious');
    }
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
