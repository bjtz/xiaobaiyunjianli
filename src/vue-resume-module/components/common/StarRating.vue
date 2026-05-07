<template>
  <div class="star-rating">
    <span
      v-for="i in 5"
      :key="i"
      class="star"
      :class="{ filled: i <= filledStars, half: i === halfStar }"
    >
      ★
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number; // 0-5
}

const props = defineProps<Props>();

const filledStars = computed(() => Math.floor(props.value));
const halfStar = computed(() => {
  const decimal = props.value % 1;
  return decimal >= 0.5 ? Math.ceil(props.value) : 0;
});
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 14px;
}

.star.filled {
  color: #ffc107;
}

.star.half {
  position: relative;
  color: #ddd;
}

.star.half::before {
  content: '★';
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: #ffc107;
}
</style>
