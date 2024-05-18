interface Track {
  soundcloud_id: number;
  title: string;
  artist: string;
  duration_ms: number;
  date_added: string;
  waveform_url: string;
  permalink_url: string;
  waveform_data: null | WaveformData;
  audio_url: null | string;
  audio_error: boolean;
}

interface WaveformData {
  width: number;
  height: number;
  samples: number[];
}

interface Playlist {
  tracks_in_order: Track[];
  url: string;
  name: string;
  slug: string;
  order: number;
  isCustom: boolean;
  total_tracks: number;
}

interface PlaylistResponse {
  status_code: number;
  summary_message: string;
  payload: Playlist[];
}
