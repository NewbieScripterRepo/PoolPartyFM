<script lang="ts" setup>
import { computed, onMounted, PropType } from "nativescript-vue";

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  }, // 0.0 - 100.0
  waveform: {
    type: Object as PropType<WaveformData>,
    default: () => ({}),
  },
});

const barsCount = 100;
const maxHeight = 80;
const minHeight = 10;
let bars = computed(() => {
  const data = [];
  if (!props.waveform.samples) {
    for (let i = 0; i < barsCount; i++) {
      data.push(minHeight);
    }
  } else {
    const { width, height, samples } = props.waveform;
    const step = Math.floor(width / barsCount);
    for (let i = 0; i < barsCount; i++) {
      const start = i * step;
      const end = (i + 1) * step;
      const average =
        samples.slice(start, end).reduce((sum, value) => sum + value, 0) / step;
      data.push((average * (maxHeight - minHeight)) / height + minHeight);
    }
  }
  return data;
});

// build string like *,*,*
const columns = computed(() => Array(barsCount).fill("*").join(","));
const barStyles = computed(() =>
  bars.value.map((bar, index) => ({
    class: index < props.progress ? "bg-zinc-500" : "bg-zinc-700",
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
