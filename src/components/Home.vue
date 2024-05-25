<script lang="ts" setup>
import { Dialogs, FormattedString } from "@nativescript/core";
import { AudioPlayer } from "@/utils/AudioPlayer";
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "nativescript-vue";
import ProgressBar from "./ProgressBar.vue"; // Adjust the path as necessary

/**
 * Global state
 */
const playListData = ref<null | PlaylistResponse>(null);
let audioPlayer: AudioPlayer | null = null;
const progressTimer = ref<any>(null);

/**
 * Page events
 */

const onLoaded = () => {
  if (!audioPlayer) {
    audioPlayer = new AudioPlayer();
  }
  if (!playListData.value) {
    fetchPlaylist();
  }
};

onMounted(() => {
  // keep track of progress
  progressTimer.value = setInterval(() => {
    if (playState.value === "playing" && activeTrack.value) {
      const duration = activeTrack.value.duration_ms;
      const currentMs = audioPlayer.getCurrentTime();
      progressInMs.value = currentMs;
      progress.value = (currentMs / duration) * 100;
    } else {
      // progress.value = 0;
      // progressInMs.value = 0;
    }
    updateProgressText();
  }, 1000);
});

const updateProgressText = () => {
  progressText.value = `${convertToHHmm(progressInMs.value)} / ${convertToHHmm(
    activeTrack.value?.duration_ms || 0
  )}`;
};

onUnmounted(() => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value);
  }
});

const onTapChannel = () => {
  Dialogs.action({
    message: "Select a channel",
    cancelButtonText: "Cancel",
    actions: playListData.value?.payload.map((playlist) => playlist.name) || [],
  }).then((result) => {
    if (result !== "Cancel") {
      if (activePlaylist.value?.name === result) {
        return;
      }
      const selectedPlaylist = playListData.value?.payload.find(
        (playlist) => playlist.name === result
      );
      if (selectedPlaylist) {
        setPlaylist(selectedPlaylist);
      }
    }
  });
};

/**
 * Play state
 */
const playState = ref<string>("paused");
const activePlaylist = ref<Playlist | null>(null);
const activeTrack = ref<Track | null>(null);
const activeIndex = ref(0);
const progress = ref(0.0); // in percent
const progressInMs = ref(0); // in milliseconds
const progressText = ref("0:00 / 0:00");
const loop = ref(false);

const onTapBackward = () => {
  // previous track
  if (activePlaylist.value) {
    pauseAudio();
    const tracks = activePlaylist.value.tracks_in_order;
    const currentIndex = activeIndex.value;
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      setActiveTrack(tracks[newIndex]);
      activeIndex.value = newIndex;
    }
  }
};

const onTapForward = () => {
  // next track
  if (activePlaylist.value) {
    pauseAudio();
    const tracks = activePlaylist.value.tracks_in_order;
    const currentIndex = activeIndex.value;
    const newIndex = currentIndex + 1;
    if (newIndex < tracks.length) {
      setActiveTrack(tracks[newIndex]);
      activeIndex.value = newIndex;
    }
  }
};

const hasNextTrack = () => {
  if (activePlaylist.value) {
    const tracks = activePlaylist.value.tracks_in_order;
    const currentIndex = activeIndex.value;
    return currentIndex < tracks.length - 1;
  }
  return false;
};

const onTapPlay = () => {
  // toggle play state
  if (playState.value === "paused" && activeTrack.value) {
    playState.value = "playing";
    playAudio();
  } else {
    playState.value = "paused";
    pauseAudio();
  }
};

const setPlaylist = (playlist: Playlist) => {
  activePlaylist.value = playlist;
  if (playlist.tracks_in_order[0]) {
    setActiveTrack(playlist.tracks_in_order[0]);
    activeIndex.value = 0;
  } else {
    setActiveTrack(null);
    activeIndex.value = 0;
  }
};

const setActiveTrack = (track: Track | null) => {
  activeTrack.value = track;
  // reset progress
  progress.value = 0;
  progressInMs.value = 0;
  updateProgressText();
  console.log("Switch track: ", track?.title);
  if (track) {
    fetchTrackMeta(track).then(() => {
      loadAudio(track);
    });
  }
};

const loadAudio = (track: Track) => {
  const goNextSong = () => {
    if (hasNextTrack()) {
      onTapForward();
    } else {
      playState.value = "paused";
    }
  };
  if (!track.audio_url || track.audio_error) {
    console.log("Continue to next song due to audio error");
    // continue
    goNextSong();
    return;
  }

  audioPlayer.openUrl(track.audio_url, {
    autoplay: playState.value === "playing",
    onFinished: () => {
      console.log("Audio finished");
      goNextSong();
    },
    onError: (error) => {
      console.error("Audio error", error);
      track.audio_error = true;
      goNextSong();
    },
  });
};

const playAudio = () => {
  audioPlayer.play();
};

const pauseAudio = () => {
  audioPlayer.pause();
};

/**
 * APIs
 */

const fetchPlaylist = () => {
  playState.value = "loading";
  fetch("https://api.poolsidefm.workers.dev/v1/get_tracks_by_playlist")
    .then((response) => response.json())
    .then((data: PlaylistResponse) => {
      playListData.value = data;
      setPlaylist(playListData.value.payload[0]);
      playState.value = "paused";
    })
    .catch((error) => {
      console.error("Error fetching playlist", error);
      playState.value = "paused";
    });
};

const fetchTrackMeta = (track: Track) => {
  return Promise.all([fetchTrackWaveform(track), fetchTrackAudio(track)]);
};

const fetchTrackWaveform = (track: Track) => {
  if (track.waveform_data) {
    return;
  }

  const jsonUrl = track.waveform_url.replace(".png", ".json");
  return fetch(jsonUrl)
    .then((response) => response.json())
    .then((data) => {
      track.waveform_data = data;
    })
    .catch((error) => {
      console.error("Error fetching waveform", error);
    });
};

const fetchTrackAudio = (track: Track) => {
  const trackId = track.soundcloud_id;
  track.audio_url = `https://api.poolsidefm.workers.dev/v2/get_sc_mp3_stream?track_id=${trackId}`;
};

/**
 * Misc
 */

const dummyTap = () => {
  console.log("dummy tap");
};

const convertToHHmm = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
</script>

<template>
  <Frame>
    <Page class="bg-orange-100" @loaded="onLoaded">
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
            class="fas text-xs z-0 bg-transparent rounded-full"
            color="#fff"
            col="0"
            row="0"
            width="60"
            height="60"
            :text="$fonticon('fa-caret-left')"
            @tap="dummyTap"
          />

          <Button
            class="border border-r-4 border-b-4 border-white rounded bg-zinc-800 font-pixelarial"
            color="#fff"
            col="1"
            row="0"
            height="50"
            text="$fonticon('fa-angle-left')"
            @tap="onTapChannel"
          >
            <FormattedString>
              <Span fontSize="8" text="Channel: " />
              <Span
                fontSize="16"
                class="font-chikarego2"
                :text="activePlaylist?.name"
              />
              <Span text=" " />
              <Span class="fas text-xs" :text="$fonticon('fa-sort')" />
            </FormattedString>
          </Button>

          <Button
            class="fas text-xs z-0 bg-transparent rounded-full"
            color="#fff"
            col="2"
            row="0"
            width="60"
            height="60"
            :text="$fonticon('fa-caret-right')"
            @tap="dummyTap"
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
            class="fas text-sm bg-transparent z-0 rounded-full"
            color="#000"
            col="0"
            row="1"
            :text="$fonticon('fa-arrow-up-from-bracket')"
            height="60"
            width="60"
            @tap="dummyTap"
          />
          <Button
            class="fa text-sm bg-transparent z-0 rounded-full"
            color="#000"
            col="3"
            row="1"
            height="60"
            width="60"
            :text="$fonticon('fa-heart')"
            @tap="dummyTap"
          />

          <StackLayout row="1" col="1" colSpan="2" class="py-2">
            <Label
              color="#000"
              class="text-black font-pixelarial text-center"
              :text="progressText"
            />
            <Label
              class="text-black my-2 text-center font-chikarego2"
              :text="activeTrack?.title || 'No track selected'"
            />
            <Label
              class="text-black font-pixelarial text-center"
              :text="activeTrack?.artist || 'Unknown artist'"
            />
          </StackLayout>

          <GridLayout
            class="mx-4 mt-8 border-2 border-r-8 border-b-8 border-black rounded"
            row="2"
            col="0"
            colSpan="4"
            columns="*,*,*"
            rows="*"
            height="auto"
          >
            <Button
              class="fas text-sm bg-transparent z-0 border-r-2 border-black"
              color="#000"
              col="0"
              row="0"
              :text="$fonticon('fa-step-backward')"
              @tap="onTapBackward"
            />
            <Button
              class="fas text-sm z-0 border bg-transparent border-transparent"
              color="#000"
              col="1"
              row="0"
              :text="
                playState === 'paused'
                  ? $fonticon('fa-play')
                  : $fonticon('fa-pause')
              "
              @tap="onTapPlay"
            />
            <Button
              class="fas text-sm bg-transparent z-0 border-l-2 border-black"
              color="#000"
              col="2"
              row="0"
              :text="$fonticon('fa-step-forward')"
              @tap="onTapForward"
            />
          </GridLayout>

          <Button
            class="text-right font-pixelarial pr-4 bg-transparent z-0"
            height="40"
            row="3"
            col="1"
            @tap="dummyTap"
          >
            <FormattedString>
              <Span class="fa" :text="$fonticon('fa-paper-plane')" />
              <Span text=" Airplay" />
            </FormattedString>
          </Button>

          <Button
            class="text-left font-pixelarial pl-4 bg-transparent z-0"
            height="40"
            row="3"
            col="2"
            @tap="dummyTap"
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
~/utils/AudioPlayer
