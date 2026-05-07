<template>
  <div class="section-header">
    <img v-if="iconSrc" :src="iconSrc" alt="" width="26" height="26" />
    <h1 :style="{ background: color }">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  color: string;
  icon?: string;
}

const props = defineProps<Props>();

const iconSrc = computed(() => {
  if (!props.icon) return null;
  // 可以根据实际情况调整图标路径
  return `images/${props.icon}.png`;
});
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.section-header img {
  margin-right: 8px;
}

h1 {
  position: relative;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  line-height: 26px;
  padding: 0 100px 0 10px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  margin: 0;
}

h1::before {
  content: '';
  display: block;
  width: 18.4px;
  height: 18.4px;
  background: #f2f2f2;
  position: absolute;
  right: -9px;
  top: 4px;
  transform: rotate(45deg);
}
</style>
