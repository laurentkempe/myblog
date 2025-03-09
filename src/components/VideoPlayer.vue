<script lang="ts" setup>
// Import styles.
import 'vidstack/player/styles/base.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/icons';
import type { MediaPlayerElement } from 'vidstack/elements';
import { ref } from 'vue';
import VideoLayout from './layouts/VideoLayout.vue';

interface Props {
  video: string
  startTime: number,
  title: string
}
const props = defineProps<Props>()

const $player = ref<MediaPlayerElement>();
</script>

<template>

  <media-player
    class="w-full aspect-video bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
    :title="title"
    :src="`youtube/${video}`"
    :clip-start-time="startTime"
    crossOrigin
    playsInline
    ref="$player"
  >
    <media-provider>
    </media-provider>

    <VideoLayout />
  </media-player>
</template>
