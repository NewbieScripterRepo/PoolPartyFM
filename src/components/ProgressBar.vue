<script lang="ts" setup>
import { computed, onMounted, ref } from "nativescript-vue";

const barsCount = 90;
const maxHeight = 80;
const minHeight = 10;
let bars = ref<Number[]>([]);
// create 90 bars
for (let i = 0; i < barsCount; i++) {
  bars.value.push(Math.random() * (maxHeight - minHeight) + minHeight);
}

// build string like *,*,*
const columns = computed(() => Array(barsCount).fill("*").join(","));
const barStyles = computed(() =>
  bars.value.map((bar) => ({
    class: "bg-zinc-700",
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
    <Label text="abc" />

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
