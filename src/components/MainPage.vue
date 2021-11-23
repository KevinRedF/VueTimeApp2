<template>
  <div class="container">
    <router-link to="/login" class="log-btn">
      <q-icon name="logout" class="log-icon" />
    </router-link>
    <router-link to="/statistics" class="data-btn">
      <q-icon name="bar_chart" class="data-icon" />
    </router-link>
    <div class="header">
      <h1 class="title">Vue Time App</h1>
      <h2 class="date">{{ currentDate() }}</h2>
    </div>
    <div class="activity-container">
      <q-btn class="add-btn" @click="modalOpen = true">
        <q-icon v-if="!hasActiveTask" name="add" class="icon" />
        <q-icon v-else :name="currentIcon" class="current-svg icon" />
      </q-btn>
      <div v-if="userActivities.length !== 0" class="activities">
        <activity-group v-if="activeTasks.length !== 0">
          <template v-slot:header>
            <p class="group-title">Currently active</p>
            <icon icon-type="pencil" styling="title-icon" />
          </template>
          <activity-card
            v-for="activity in activeTasks"
            :key="activity.id"
            :id="activity.id"
            :name="activity.name"
            :status="activity.status"
            :icon="activity.icon"
            :startingTime="activity.startingTime"
            @finish-act="updateUserActivity"
          />
        </activity-group>
        <activity-group v-if="nextTasks.length !== 0">
          <template v-slot:header>
            <p class="group-title">Next Activities</p>
          </template>
          <activity-card
            v-for="activity in nextTasks"
            :key="activity.id"
            :id="activity.id"
            :name="activity.name"
            :status="activity.status"
            :icon="activity.icon"
            :startingTime="activity.startingTime"
            @start-act="updateUserActivity"
          />
        </activity-group>
        <activity-group v-if="finishedTasks.length !== 0">
          <template v-slot:header>
            <p class="group-title">Completed activities</p>
          </template>
          <activity-card
            v-for="activity in finishedTasks"
            :key="activity.id"
            :id="activity.id"
            :name="activity.name"
            :status="activity.status"
            :icon="activity.icon"
            :startingTime="activity.startingTime"
            :endingTime="activity.endingTime"
          />
        </activity-group>
      </div>
      <div v-else class="no-tasks">
        <icon icon-type="pencil" styling="empty-icon" />
        <p class="empty-text">You have not registered activities today.</p>
      </div>
    </div>

    <q-dialog v-model="modalOpen" full-width persistent>
      <AddActivity @add-act="addUserActivity" :activities="activities" />
    </q-dialog>
  </div>
</template>

<script>
import ActivityCard from "./ActivityCard.vue";
import ActivityGroup from "./ActivityGroup.vue";
import Icon from "./Icon.vue";
import AddActivity from "./AddActivity.vue";
import gql from "graphql-tag";
import USER_ACTIVITIES_ALL from "../graphql/UserActivitiesAll.gql";
import ACTIVITIES_ALL from "../graphql/ActivitiesAll.gql";

export default {
  name: "MainPage",
  components: {
    ActivityCard,
    Icon,
    ActivityGroup,
    AddActivity,
  },
  created() {
    if (!this.$route.params.user) {
      this.$route.push("/login");
    }
  },
  apollo: {
    activities: {
      query: ACTIVITIES_ALL,
    },
    userActivities: {
      query: USER_ACTIVITIES_ALL,
      update({ userActivities }) {
        return userActivities;
      },
      variables() {
        return {
          userEmail: this.$route.params.user,
          date: this.currentDateFormatted(),
        };
      },
    },
  },
  data: function() {
    return {
      modalOpen: false,
      activities: [],
      userActivities: [],
    };
  },
  computed: {
    hasActiveTask: function() {
      const isValid = this.userActivitiesMapped.find((activity) => {
        return activity?.status === "active";
      });
      return isValid ? true : false;
    },
    userActivitiesMapped() {
      return this.userActivities.map((userAct) => {
        const foundActivity = this.activities.find(
          (act) => act.id === userAct.activityId
        );
        if (foundActivity) {
          return {
            id: userAct.id,
            name: foundActivity.name,
            description: foundActivity.description,
            status: "",
            icon: foundActivity.icon,
            startingTime: userAct.startTime,
            endingTime: userAct.endTime,
          };
        }
      });
    },
    activeTasks: function() {
      const isValid = this.userActivitiesMapped.filter((activity) => {
        if (activity && activity.startingTime && !activity.endingTime) {
          activity.status = "active";
          return activity;
        }
      });
      return isValid;
    },
    finishedTasks: function() {
      return this.userActivitiesMapped.filter((activity) => {
        if (activity && activity.startingTime && activity.endingTime) {
          activity.status = "finished";
          return activity;
        }
      });
    },
    nextTasks: function() {
      return this.userActivitiesMapped.filter((activity) => {
        if (activity && !activity.startingTime && !activity.endingTime) {
          activity.status = "next";
          return activity;
        }
      });
    },
    currentIcon: function() {
      return this.hasActiveTask ? this.activeTasks[0].icon : "";
    },
  },

  methods: {
    currentDate() {
      const current = new Date();
      const date = `${current.toLocaleDateString("en-US", {
        weekday: "long",
      })}, ${current.getDate()} ${current.toLocaleString("en-US", {
        month: "long",
      })}`;
      return date;
    },
    currentDateFormatted() {
      var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },

    getActivity(actId) {
      return this.activities.find((act) => act.id === actId);
    },
    startActivity(actId) {
      const foundActivity = this.currentActivities.find(
        (activity) => activity.id === actId
      );

      this.currentActivities.map((activity) => {
        if (activity.status === "active") {
          activity.status = "finished";
        }
      });
      foundActivity.status = "active";
    },

    addUserActivity(act) {
      const userEmail = this.$route.params.user;
      const date = this.currentDateFormatted();

      const newAct = {
        activityId: act.id,
        date: date,
        endTime: null,
        startTime: null,
        userEmail: userEmail,
      };

      // Call to the graphql mutation
      console.log(act);
      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation addUserActivity(
              $newActivity: [timeTracker_userActivity_insert_input!]!
            ) {
              addUserActivity: insert_timeTracker_userActivity(
                objects: $newActivity
              ) {
                affected_rows
                returning {
                  id
                  activityId
                  date
                  endTime
                  startTime
                  userEmail
                }
              }
            }
          `,
          // Parameters
          variables: {
            newActivity: newAct,
          },
          // Update the cache with the result
          // The query will be updated with the optimistic response
          // and then with the real result of the mutation
          update: (store, { data: { addUserActivity } }) => {
            // Add to All user activities list
            const data = store.readQuery({
              query: USER_ACTIVITIES_ALL,
              variables: {
                userEmail: userEmail,
                date: date,
              },
            });

            const userActivitiesCopy = data.userActivities.slice();
            userActivitiesCopy.push(...addUserActivity.returning);

            store.writeQuery({
              query: USER_ACTIVITIES_ALL,
              variables: {
                userEmail: userEmail,
                date: date,
              },
              data: {
                userActivities: userActivitiesCopy,
              },
            });
          },
          // Optimistic UI
          // Will be treated as a 'fake' result as soon as the request is made
          // so that the UI can react quickly and the user be happy
          optimisticResponse: {
            __typename: "timeTracker_userActivity_mutation_response",
            addUserActivity: {
              __typename: "timeTracker_userActivity",
              affected_rows: 1,
              returning: [
                {
                  activityId: newAct.activityId,
                  date: newAct.date,
                  endTime: null,
                  id: -1,
                  startTime: null,
                  userEmail: newAct.userEmail,
                },
              ],
            },
          },
        })
        .then((data) => {
          // Result
          console.log(data);
        })
        .catch((error) => {
          // Error
          console.error(error);
          // We restore the initial user input
        });
      this.modalOpen = false;
    },

    updateUserActivity(actId, startTime, endTime) {
      // Call to the graphql mutation

      const userEmail = this.$route.params.user;
      const date = this.currentDateFormatted();

      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation updateUserActivity(
              $activityId: Int!
              $startingTime: time!
              $endingTime: time
            ) {
              updateUserActivity: update_timeTracker_userActivity(
                where: { id: { _eq: $activityId } }
                _set: { endTime: $endingTime, startTime: $startingTime }
              ) {
                returning {
                  endTime
                  id
                  startTime
                }
              }
            }
          `,
          // Parameters
          variables: {
            activityId: actId,
            startingTime: startTime,
            endingTime: endTime,
          },
          // Update the cache with the result
          // The query will be updated with the optimistic response
          // and then with the real result of the mutation
          update: (store, { data: { updateUserActivity } }) => {
            // Add to All user activities list
            const data = store.readQuery({
              query: USER_ACTIVITIES_ALL,
              variables: {
                userEmail: userEmail,
                date: date,
              },
            });

            const userActivitiesCopy = [...data.userActivities];
            const updatedData = updateUserActivity.returning.length
              ? updateUserActivity.returning[0]
              : null;

            const foundActivity = userActivitiesCopy.find(
              (act) => act.id === actId
            );

            const itemIndex = userActivitiesCopy.indexOf(foundActivity);

            let foundActivityCopy = { ...foundActivity };
            foundActivityCopy.startTime = updatedData.startTime;
            foundActivityCopy.endTime = updatedData.endTime;

            if (itemIndex > -1) {
              userActivitiesCopy.splice(itemIndex, 1);
              userActivitiesCopy.push(foundActivityCopy);
            }

            store.writeQuery({
              query: USER_ACTIVITIES_ALL,
              variables: {
                userEmail: userEmail,
                date: date,
              },
              data: {
                userActivities: userActivitiesCopy,
              },
            });
          },
          // Optimistic UI
          // Will be treated as a 'fake' result as soon as the request is made
          // so that the UI can react quickly and the user be happy
          optimisticResponse: {
            __typename: "timeTracker_userActivity_mutation_response",
            updateUserActivity: {
              __typename: "timeTracker_userActivity",
              affected_rows: 1,
              returning: [
                {
                  endTime: endTime,
                  id: actId,
                  startTime: startTime,
                },
              ],
            },
          },
        })
        .then((data) => {
          // Result
          console.log(data);
        })
        .catch((error) => {
          // Error
          console.error(error);
          // We restore the initial user input
        });
      this.modalOpen = false;
    },
  },
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
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.plus-svg {
  width: 21px;
  height: 27px;
}
.icon {
  width: 40px;
  height: 38px;
  color: #0a47ed;
}
.log-btn {
  position: absolute;
  top: 12px;
  left: 12px;
}
.log-icon {
  font-size: 20px;
  color: white;
}
.data-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0;
  background-color: transparent;
  border: 0;
}
.data-icon {
  font-size: 20px;
  color: white;
}
.current-svg {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    color: #0a47ed;
  }
  50% {
    color: white;
  }
  100% {
    color: #0a47ed;
  }
}
.title {
  font-family: "WTGothic-Bold";
  font-size: 30px;
  line-height: 32px;
  color: #fff;
  text-align: center;
  width: calc(100% - 60px);
  margin: 0 0 20px 0;
}
.date {
  font-family: "WTGothic";
  font-size: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  width: calc(100% - 60px);
  margin: 0;
}
.activity-container {
  position: relative;
  width: calc(100% + 1px);
  height: calc(100vh - 250px);
  background: #fff;
  border-radius: 50px 50px 0 0;
}
.add-btn {
  position: absolute;
  font-family: "WTGothic";
  font-size: 1.5em;
  padding: 0;
  top: -35px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 5px solid #0a47ed;
  color: #0a47ed;
  min-height: 60px;
}
.activities {
  width: 100%;
  height: auto;
  padding: 30px 0 0 0;
}
.group-title {
  font-family: "Roboto";
  font-weight: bold;
  font-size: 16px;
  margin: 15px 0 10px 0;
}
.title-icon {
  width: 16px;
  height: 16px;
  margin: auto 5px;
}
.no-tasks {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.empty-text {
  width: 100%;
  font-family: "Roboto";
  font-size: 18px;
}
.empty-icon {
  width: 150px;
  height: 150px;
  margin-bottom: 32px;
}
</style>
