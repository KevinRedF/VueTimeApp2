<template>
  <div class="group">
    <header>
        <slot name="header"></slot>
    </header>
    <slot></slot>
  </div>
</template>

<style scoped>
  .group{
    position: relative;
    width: 100%;
    height: auto;
    margin: 0 auto 0 auto;
  }
  header{
    width: calc(100% - 52px);
    margin: 0 auto 0 auto;
    display: flex;
  }
</style>

<script>
import { ref } from 'vue'
export default {
  setup () {
    return {
      text: ref('')
    }
  }
}
</script>
