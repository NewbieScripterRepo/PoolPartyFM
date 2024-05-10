<script lang="ts" setup>
import { computed, onMounted, ref } from "nativescript-vue";

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  }, // 0.0 - 100.0
});

const barsCount = 100;
const maxHeight = 80;
const minHeight = 10;
let bars = ref<Number[]>([]);
// create 100 bars
for (let i = 0; i < barsCount; i++) {
  bars.value.push(Math.random() * (maxHeight - minHeight) + minHeight);
}

// build string like *,*,*
const columns = computed(() => Array(barsCount).fill("*").join(","));
const barStyles = computed(() =>
  bars.value.map((bar, index) => ({
    class: index < props.progress ? "bg-zinc-700" : "bg-zinc-700",
    styles: {
      height: `${bar}%`,
      margin: "0 0.25",
    },
  }))
);

onMounted(() => {});
</script>

<template>
  <GridLayout rows="*" :columns="columns">
    <StackLayout
      row="0"
      :col="index"
      v-for="(bar, index) in bars"
      :key="index"
      :class="barStyles[index].class"
      :style="barStyles[index].styles"
      verticalAlignment="bottom"
    />
  </GridLayout>
</template>

<style></style>
