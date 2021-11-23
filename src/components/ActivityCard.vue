<template>
  <div
    :class="{
      'activity-div': true,
      'active-div': status === 'active',
    }"
  >
    <div class="icon-container">
      <q-icon class="blue" :name="icon" size="xl" />
    </div>
    <div class="act-data">
      <p class="act-title">{{ name }}</p>
      <p v-if="status === 'active'" class="act-timing">
        In Progress
      </p>
      <p v-else-if="status === 'next'" class="act-timing">
        Next Activity
      </p>
      <p v-else class="act-timing">
        {{ `${startingTime} - ${endingTime}` }}
      </p>
    </div>
    <p v-if="status === 'finished'" class="act-total-time">
      {{ getUsedTime() }}
    </p>
    <button
      v-else-if="status === 'next'"
      class="button-a"
      @click="startActivity"
    >
      <q-icon class="blue" name="play_arrow" size="lg" />
      Start
    </button>
    <button v-else class="button-a" @click="finishActivity()">
      <q-icon class="blue" name="check" size="lg" />
      Finish
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    return {
      text: ref(""),
    };
  },
  components: {},
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    startingTime: {
      type: String,
      required: false,
    },
    endingTime: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  methods: {
    finishActivity() {
      this.$emit("finish-act", this.id, this.startingTime, this.currentTime());
    },
    currentTime() {
      var d = new Date();

      return [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
    },
    startActivity() {
      this.$emit("start-act", this.id, this.currentTime(), null);
    },
    getUsedTime() {
      if (this.endingTime) {
        const sTimes = this.startingTime.split(":");
        const fTimes = this.endingTime.split(":");
        const sHour = parseInt(sTimes[0]);
        const sMin = parseInt(sTimes[1]);
        const fHour = parseInt(fTimes[0]);
        const fMin = parseInt(fTimes[1]);
        let hourDif = fHour - sHour;
        let minuteDif = fMin + (fMin < sMin ? 60 : 0) - sMin;
        return `${hourDif !== 0 ? hourDif : ""}${
          hourDif && minuteDif ? "." : ""
        }${
          minuteDif !== 0
            ? minuteDif.toLocaleString("en-US", { minimumIntegerDigits: 2 })
            : ""
        } ${hourDif !== 0 ? (hourDif === 1 ? "hour" : "hours") : "minutes"}`;
      }
      return "NaN";
    },
  },
};
</script>

<style scoped>
.activity-div {
  position: relative;
  width: calc(100% - 32px);
  height: 100px;
  border-radius: 30px;
  padding: 10px 0;
  margin: 20px auto 0 auto;
  border: solid 1px rgb(33, 35, 34, 0.1);
  display: flex;
}
.activity-div:first-of-type {
  margin: 0 auto 0 auto;
}
.active-div {
  animation: rotateThis linear 2.5s infinite;
  box-shadow: -2px 2px 6px 0 rgba(10, 71, 237, 0.5);
  border: 1px solid rgba(10, 71, 237, 0.2);
}
.check-svg {
  width: 27px;
  height: 27px;
  padding: 5px;
  border-radius: 30px;
  color: white;
  background: rgba(10, 71, 237);
  margin: auto;
}
.button-a {
  font-family: "Roboto";
  width: 55px;
  height: 55px;
  border: 0;
  background: transparent;
  border-radius: 50px;
  margin: auto;
  text-decoration: underline;
}
@keyframes rotateThis {
  0% {
    box-shadow: -2px 2px 6px 0 rgba(10, 71, 237, 0.5);
  }
  25% {
    box-shadow: 2px 2px 6px 0 rgba(10, 71, 237, 0.5);
  }
  50% {
    box-shadow: 2px -2px 6px 0 rgba(10, 71, 237, 0.5);
  }
  75% {
    box-shadow: -2px -2px 6px 0 rgba(10, 71, 237, 0.5);
  }
}
.activity-div:first-child {
  margin: 0 auto 0 auto;
}
.icon-container {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  margin: auto 0 auto 20px;
}
.act-icon {
  font-size: 60px;
}
.act-data {
  width: calc(100% - 60px - 96px);
  height: 100%;
  padding: 0 0 0 20px;
}
.act-title {
  display: flex;
  align-content: center;
  margin: 0;
  align-items: center;
  font-family: "Roboto";
  font-weight: bold;
  font-size: 20px;
  height: 50%;
  line-height: 50%;
  color: #212322;
}
.act-timing {
  display: flex;
  margin: 0;
  align-content: center;
  align-items: center;
  font-family: "Roboto";
  font-size: 16px;
  height: 50%;
  line-height: 50%;
  color: #212322;
}
.act-total-time {
  margin: auto;
  font-family: "Roboto";
  text-align: center;
  font-size: 18px;
  line-height: 18px;
  width: 68px;
  padding: 0 0px;
  color: #212322;
}
.blue {
  color: #0a47ed;
}
</style>
