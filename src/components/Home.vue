<script lang="ts" setup>
import { onMounted, onUnmounted } from "nativescript-vue";

onMounted(() => {});

onUnmounted(() => {});
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
            class="fas text-center font-bold text-xs color-orange-100"
            col="1"
            row="1"
            :text="$fonticon('fa-explosion')"
          />
          <Label
            class="fa font-bold text-xs color-orange-100"
            col="2"
            row="1"
            :text="$fonticon('fa-user')"
          />
        </GridLayout>
      </ActionBar>
    </Page>
  </Frame>
</template>

<style></style>
