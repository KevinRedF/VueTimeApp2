<template>
  <q-card>
    <q-toolbar>
      <q-icon class="text-secondary" name="add" size="lg" />

      <q-toolbar-title
        >Add a new
        <span class="text-weight-bold">Activity</span></q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section>
      <q-item
        clickable
        v-ripple
        v-for="activity in activities"
        :key="activity.id"
        @click="addActivity(activity)"
      >
        <q-item-section side>
          <q-icon class="text-primary" :name="activity.icon" size="lg" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ activity.name }}</q-item-label>
          <q-item-label caption>{{ activity.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>

<script>
export default {
  setup() {
    return {};
  },
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  methods: {
    addActivity(activity) {
      this.$emit("add-act", activity);
    },
  },
};
</script>
