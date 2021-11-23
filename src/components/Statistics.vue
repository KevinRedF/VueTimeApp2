<template>
  <div class="container">
    <div class="header">
      <button @click="back" class='back-btn'>
        <q-icon name="arrow_back" class="back-icon" />
      </button>
      <h1 class="header_title">Statistics</h1>
      <div class="total-time-container">
        <p class="total-time-text">{{getTotalTime}}</p>
      </div>
      <h2 class="header-text">hours registered</h2>
    </div>
    <div class="activity-container">
      <activity-group>
        <template v-slot:header>
          <p class="group-title">Activity time distribution</p>
        </template>
        <stat-row
            v-for="activity in currentActivities"
            :key="activity.id"
            :id="activity.id"
            :name="activity.name"
            :icon="activity.icon"
            :startingTime="activity.startingTime"
            :endingTime="activity.endingTime"
            :totalTime="fullTime"
          />
      </activity-group>
    </div>
  </div>
</template>

<script>
import ActivityGroup from "./ActivityGroup.vue";
import StatRow from "./StatRow.vue";
export default {
  name: "Statistics",
  components:{
    ActivityGroup,
    StatRow
  },
  inject: ["currentActivities"],
  computed: {
    getTotalTime: function() {
      let fullH = 0;
      let fullM = 0;
      this.currentActivities.forEach(act => {
        const sTimes = act.startingTime.split(":");
        const fTimes = act.endingTime.split(":");
        const sHour = parseInt(sTimes[0]);
        const sMin = parseInt(sTimes[1]);
        const fHour = parseInt(fTimes[0]);
        const fMin = parseInt(fTimes[1]);
        let hourDif = fHour - sHour;
        let minuteDif = fMin + (fMin < sMin ? 60 : 0) - sMin;
        fullH += hourDif;
        fullM += minuteDif;
        if(fullM > 59){
          fullH += 1;
          fullM = fullM - 60;
        }
      });
      return `${fullH !== 0 ? fullH : ""}${
          fullH && fullM ? "." : ""
        }${
          fullM !== 0
            ? fullM.toLocaleString("en-US", { minimumIntegerDigits: 2 })
            : ""
        }`;
    },
    fullTime: function() {
      let fullH = 0;
      let fullM = 0;
      this.currentActivities.forEach(act => {
        const sTimes = act.startingTime.split(":");
        const fTimes = act.endingTime.split(":");
        const sHour = parseInt(sTimes[0]);
        const sMin = parseInt(sTimes[1]);
        const fHour = parseInt(fTimes[0]);
        const fMin = parseInt(fTimes[1]);
        let hourDif = fHour - sHour;
        let minuteDif = fMin + (fMin < sMin ? 60 : 0) - sMin;
        fullH += hourDif;
        fullM += minuteDif;
      });
      fullH += fullM / 100;
      return fullH;
    }
  },
  methods:{
    back(){
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #0a47ed;
}
.header {
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding-top: 25px;
}
.activity-container {
  position: relative;
  width: calc(100% + 1px);
  height: calc(100vh - 180px);
  background: white;
}
.back-btn{
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0;
  background-color: transparent;
  border: 0;
}
.back-icon{
  font-size: 20px;
  color: white;
}
.header_title{
  position: absolute;
  top: 12px;
  left: 45px;
  font-size: 20px;
  font-family: 'WTGothic';
  color: white;
  width: auto;
  height: 20px;
  margin: 0;
  line-height: 1;
}
.total-time-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.header-text {
  font-size: 16px;
  font-family: 'WTGothic';
  color: white;
  width: auto;
  height: 16px;
  margin: 0;
  line-height: 1;
  margin-top: 12px;
}
.total-time-text{
  font-size: 35px;
  font-family: 'Roboto';
  color: white;
  width: auto;
  height: 35px;
  margin: 0;
  line-height: 1;
}
.group-title {
  font-family: "Roboto";
  font-weight: bold;
  font-size: 16px;
  margin: 15px 0 15px 0;
}
</style>
