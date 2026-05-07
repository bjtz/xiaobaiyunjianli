<template>
  <div class="section-title2">
    <h3 :style="{ color: color }">{{ title }}</h3>
    <div class="title-line" :style="{ background: color }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  color: string;
}

defineProps<Props>();
</script>

<style scoped>
.section-title2 {
  margin-bottom: 12px;
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title-line {
  height: 2px;
  width: 40px;
  border-radius: 1px;
}
</style>
