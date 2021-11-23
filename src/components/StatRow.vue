<template>
  <div class="row">
    <div class="stat-icon-container">
      <q-icon class="blue" :name="icon" size="md" />
    </div>
    <p class="stat-title">{{name}}</p>
    <p class="stat-percent">{{timePercentage}}</p>
  </div>
</template>

<script>
export default {
  name: "StatRow",
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startingTime: {
      type: String,
      required: true,
    },
    endingTime: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: true,
    },
    totalTime: {
      type: Number,
      required: true,
    }
  },
  computed: {
    timePercentage: function() {
      const myTime = this.getUsedTime();
      return ((myTime/this.totalTime)*100).toFixed(2) + '%';
    },
  },
  methods: {
    getUsedTime() {
        const sTimes = this.startingTime.split(":");
        const fTimes = this.endingTime.split(":");
        const sHour = parseInt(sTimes[0]);
        const sMin = parseInt(sTimes[1]);
        const fHour = parseInt(fTimes[0]);
        const fMin = parseInt(fTimes[1]);
        let hourDif = fHour - sHour;
        let minuteDif = fMin + (fMin < sMin ? 60 : 0) - sMin;
        return hourDif + (minuteDif / 100);
    },
  },
};
</script>

<style scoped>
  .row{
    position: relative;
    width: 90%;
    height: 60px;
    border-bottom: 1px solid rgba(10, 71, 237, 0.3);
    background-color: white;
    margin: 0 5% 0 5%;
  }
  .row:first-of-type{
    border-top: 1px solid rgba(10, 71, 237, 0.3);
  }
  .stat-icon-container{
    margin: auto 0 auto 0px;
  }
  .stat-title{
    font-family: "Roboto";
    font-size: 16px;
    margin: auto 0 auto 10px;
  }
  .stat-percent{
    position: absolute;
    right: 0px;
    top: 15px;
    font-family: "Roboto";
    font-size: 20px;
    font-weight: bold;
    margin: auto 0;
  }
  .blue{
    color: #0a47ed;
  }
</style>
