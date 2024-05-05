<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "nativescript-vue";

// define a variable
let progress = ref(0.0); // in percent
let timer: any;
onMounted(() => {
  timer = setInterval(() => {
    progress.value += 0.3;
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 100);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <Frame>
    <Page class="bg-orange-100">
      <ActionBar class="bg-zinc-800">
        <GridLayout rows="37, 60" columns="40,*,40" width="100%">
          <Image
            class="bg-orange-100"
            src="~/assets/top.png"
            col="0"
            colSpan="3"
            row="0"
            height="37"
            width="100%"
            stretch="fill"
          />
          <Label
            class="text-center font-bold text-xs color-orange-100"
            col="1"
            row="1"
            text="Poolparty FM"
          />
          <Label
            class="fas font-bold text-xs color-orange-100"
            col="2"
            row="1"
            :text="$fonticon('fa-arrow-right-long')"
          />
        </GridLayout>
      </ActionBar>

      <StackLayout class="p-2">
        <GridLayout
          class="pt-3 bg-zinc-800 rounded"
          columns="80,*,80"
          rows="70, 70"
          height="auto"
        >
          <Button
            class="fas text-xs bg-zinc-800"
            color="#fff"
            col="0"
            row="0"
            :text="$fonticon('fa-caret-left')"
          />

          <Button
            class="text-sm border border-r-4 border-b-4 border-white rounded bg-zinc-800"
            color="#fff"
            col="1"
            row="0"
            height="50"
            text="$fonticon('fa-angle-left')"
          >
            <FormattedString>
              <Span text="Channel: " />
              <Span class="font-bold" text="Poolsuite FM" />
              <Span text="    " />
              <Span class="fas text-xs" :text="$fonticon('fa-sort')" />
            </FormattedString>
          </Button>

          <Button
            class="fas text-xs bg-zinc-800"
            color="#fff"
            col="2"
            row="0"
            :text="$fonticon('fa-caret-right')"
          />

          <AbsoluteLayout colSpan="3" row="1" col="0" class="mt-3 bg-zinc-700">
            <StackLayout
              class="bg-zinc-600"
              height="70"
              top="0"
              left="0"
              :width="progress + '%'"
            />
          </AbsoluteLayout>
        </GridLayout>
      </StackLayout>
    </Page>
  </Frame>
</template>

<style></style>
