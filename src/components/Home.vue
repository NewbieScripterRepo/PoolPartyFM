<script lang="ts" setup>
import { FormattedString } from "@nativescript/core";
import { defineComponent, onMounted, onUnmounted, ref } from "nativescript-vue";
import ProgressBar from "./ProgressBar.vue"; // Adjust the path as necessary

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
            class="text-center text-white font-chikarego2"
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

      <StackLayout class="p-2 bg-main">
        <GridLayout
          class="pt-3 bg-zinc-800 rounded-t"
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
            class="border border-r-4 border-b-4 border-white rounded bg-zinc-800 font-pixelarial"
            color="#fff"
            col="1"
            row="0"
            height="50"
            text="$fonticon('fa-angle-left')"
          >
            <FormattedString>
              <Span text="Channel: " />
              <Span class="font-chikarego2 text-lg" text="Poolsuite FM" />
              <Span text=" " />
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

          <ProgressBar :progress="progress" row="1" colSpan="3" class="mt-3" />
        </GridLayout>

        <!-- Play control -->
        <GridLayout
          class="bg-amber-50 border-4 border-black rounded-b pb-2 bg-dots"
          rows="40, 80, 100, 90"
          columns="65,*,*,65"
        >
          <StackLayout row="0" colSpan="4" class="mb-4 bg-lines" />
          <Button
            class="fas text-sm bg-transparent z-0"
            color="#000"
            col="0"
            row="1"
            :text="$fonticon('fa-arrow-up-from-bracket')"
          />
          <Button
            class="fa text-sm bg-transparent z-0"
            color="#000"
            col="3"
            row="1"
            :text="$fonticon('fa-heart')"
          />

          <StackLayout row="1" col="1" colSpan="2" class="py-2">
            <Label
              color="#000"
              class="text-black font-pixelarial text-center"
              text="0:00 / 3:47"
            />
            <Label
              class="text-black my-2 text-center font-chikarego2"
              text="High Hopes [SOS Band Cover]"
            />
            <Label
              class="text-black font-pixelarial text-center"
              text="Basement Love"
            />
          </StackLayout>

          <GridLayout
            class="mx-4 mt-8 border-2 border-r-8 border-b-8 border-black rounded"
            row="2"
            col="0"
            colSpan="4"
            columns="*,*,*"
            height="auto"
          >
            <Button
              class="fas text-sm bg-transparent z-0 border-r-2 border-black"
              color="#000"
              col="0"
              row="0"
              :text="$fonticon('fa-step-backward')"
            />
            <Button
              class="fas text-sm bg-transparent z-0"
              color="#000"
              col="1"
              row="0"
              :text="$fonticon('fa-play')"
            />
            <Button
              class="fas text-sm bg-transparent z-0 border-l-2 border-black"
              color="#000"
              col="2"
              row="0"
              :text="$fonticon('fa-step-forward')"
            />
          </GridLayout>

          <Button
            class="text-right font-pixelarial pr-4 bg-transparent z-0"
            row="3"
            col="1"
          >
            <FormattedString>
              <Span class="fa" :text="$fonticon('fa-paper-plane')" />
              <Span text=" Airplay" />
            </FormattedString>
          </Button>

          <Button
            class="text-left font-pixelarial pl-4 bg-transparent z-0"
            row="3"
            col="2"
          >
            <FormattedString>
              <Span class="fa" :text="$fonticon('fa-user')" />
              <Span text=" Sign in" />
            </FormattedString>
          </Button>
        </GridLayout>
      </StackLayout>
    </Page>
  </Frame>
</template>

<style>
.bg-dots {
  background-image: url("~/assets/dots.png");
  background-repeat: repeat-x;
  background-position: bottom;
}

.bg-lines {
  background-image: url("~/assets/lines.png");
  background-repeat: repeat-x;
  background-position: bottom;
}

.bg-main {
  background-image: url("~/assets/bg.jpg");
  background-size: cover;
}
</style>
