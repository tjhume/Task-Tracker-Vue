import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

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
    },
    reOrder(newVal){
      this.$emit('reOrder', newVal);
    }
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
