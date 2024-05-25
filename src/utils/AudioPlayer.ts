// @ts-nocheck
import { Utils } from "@nativescript/core";

interface AudioPlayerOptions {
  autoplay?: boolean;
  onError?: Function;
  onFinished?: Function;
}

export class AudioPlayer {
  public player: any;
  private _context: any;
  private _isPlaying: boolean = false;
  private _onFinishedCallback?: Function;
  private _onErrorCallback?: Function;

  constructor() {
    this._context = Utils.android.getApplicationContext();
  }

  public openUrl(src: string, options?: AudioPlayerOptions) {
    this.release();
    const bm =
      new com.google.android.exoplayer2.upstream.DefaultBandwidthMeter.Builder(
        this._context
      ).build();
    const trackSelection =
      new com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection.Factory();
    const trackSelector =
      new com.google.android.exoplayer2.trackselection.DefaultTrackSelector(
        this._context,
        trackSelection
      );
    const loadControl = new com.google.android.exoplayer2.DefaultLoadControl();
    const builder = new com.google.android.exoplayer2.ExoPlayer.Builder(
      this._context
    );
    builder.setTrackSelector(trackSelector);
    builder.setLoadControl(loadControl);

    this.player = builder.build();
    this._setupListeners();
    this._onErrorCallback = options?.onError;
    this._onFinishedCallback = options?.onFinished;

    const userAgent = com.google.android.exoplayer2.util.Util.getUserAgent(
      this._context,
      Utils.android.getApplicationContext().getPackageName()
    );
    const dsf =
      new com.google.android.exoplayer2.upstream.DefaultDataSourceFactory(
        this._context,
        userAgent,
        bm
      );
    let vs;

    const uri = android.net.Uri.parse(src);
    const mediaItem = com.google.android.exoplayer2.MediaItem.fromUri(uri);
    vs =
      new com.google.android.exoplayer2.source.ProgressiveMediaSource.Factory(
        dsf
      ).createMediaSource(mediaItem);

    this.player.setMediaSource(vs);

    if (options?.autoplay) {
      this.player.prepare();
      this.player.setPlayWhenReady(true);
    }
  }

  public release() {
    if (this.player) {
      this.player.stop();
      this.player.release();
      this.player = null;
      const am = this._context.getSystemService(
        android.content.Context.AUDIO_SERVICE
      );
      if (com.google.android.exoplayer2.util.Util.SDK_INT >= 26) {
        const afr = new android.media.AudioFocusRequest.Builder(
          android.media.AudioManager.AUDIOFOCUS_GAIN
        ).build();
        am.abandonAudioFocusRequest(afr);
      } else {
        am.abandonAudioFocus(null);
      }
    }
  }

  public play() {
    if (this.player) {
      this._isPlaying = true;
      this.player.prepare();
      this.player.setPlayWhenReady(true);
    }
  }

  public pause() {
    if (this.player) {
      this._isPlaying = false;
      this.player.setPlayWhenReady(false);
    }
  }

  public getCurrentTime() {
    if (!this.player) {
      return 0;
    }
    return this.player.getCurrentPosition();
  }

  private _setupListeners() {
    const playerListener = new com.google.android.exoplayer2.Player.Listener({
      onEvents: function (_player, _events) {
        /* required in listener implementation */
      },
      onTimelineChanged: function (_timeline, _manifest) {
        /* required in listener implementation */
      },
      onMediaItemTransition: function (_mediaItem, _reason) {
        /* required in listener implementation */
      },
      onTracksChanged: function (_trackGroups, _trackSelections) {
        /* required in listener implementation */
      },
      onTracksInfoChanged: function (_tracksInfo) {
        /* required in listener implementation */
      },
      onMediaMetadataChanged: function (_mediaMetadata) {
        /* required in listener implementation */
      },
      onPlaylistMetadataChanged: function (_mediaMetadata) {
        /* required in listener implementation */
      },
      onIsLoadingChanged: function (_isLoading) {
        /* required in listener implementation */
      },
      onLoadingChanged: function (_isLoading) {
        /* required in listener implementation */
      },
      onAvailableCommandsChanged: function (_availableCommands) {
        /* required in listener implementation */
      },
      onTrackSelectionParametersChanged: function (_parameters) {
        /* required in listener implementation */
      },
      onPlayerStateChanged: function (playWhenReady, playbackState) {
        /* required in listener implementation */
      },
      onPlaybackStateChanged: function (playbackState) {
        if (
          playbackState === com.google.android.exoplayer2.Player.STATE_ENDED
        ) {
          if (this._onFinishedCallback) {
            this._onFinishedCallback();
          }
        }
      },
      onPlayWhenReadyChanged: function (playWhenReady, _reason) {
        /* required in listener implementation */
      },
      onPlaybackSuppressionReasonChanged: function (
        _playbackSuppressionReason
      ) {
        /* required in listener implementation */
      },
      onIsPlayingChanged: function (_isPlaying) {
        /* required in listener implementation */
      },
      onRepeatModeChanged: function (_repeatMode) {
        /* required in listener implementation */
      },
      onShuffleModeEnabledChanged: function (_shuffleModeEnabled) {
        /* required in listener implementation */
      },
      onPlayerError: function (error) {
        if (this._onErrorCallback) {
          this._onErrorCallback(error);
        }
      },
      onPlayerErrorChanged: function (_error) {
        /* required in listener implementation */
      },
      onPositionDiscontinuity: function (
        _reasonOrOldPosition,
        _newPosition,
        _reason
      ) {
        /* required in listener implementation */
      },
      onPlaybackParametersChanged: function (_playbackParameters) {
        /* required in listener implementation */
      },
      onSeekBackIncrementChanged: function (_param0) {
        /* required in listener implementation */
      },
      onSeekForwardIncrementChanged: function (_seekBackIncrementMs) {
        /* required in listener implementation */
      },
      onMaxSeekToPreviousPositionChanged: function (
        _maxSeekToPreviousPositionMs
      ) {
        /* required in listener implementation */
      },
      onSeekProcessed: function () {
        /* required in listener implementation */
      },
      onAudioSessionIdChanged: function (_audioSessionId) {
        /* required in listener implementation */
      },
      onAudioAttributesChanged: function (_audioAttributes) {
        /* required in listener implementation */
      },
      onVolumeChanged: function (_volume) {
        /* required in listener implementation */
      },
      onSkipSilenceEnabledChanged: function (_skipSilenceEnabled) {
        /* required in listener implementation */
      },
      onDeviceInfoChanged: function (_deviceInfo) {
        /* required in listener implementation */
      },
      onDeviceVolumeChanged: function (_volume, _muted) {
        /* required in listener implementation */
      },
      onVideoSizeChanged: function (_videoSize) {
        /* required in listener implementation */
      },
      onSurfaceSizeChanged: function (_width, _height) {
        /* required in listener implementation */
      },
      onRenderedFirstFrame: function () {
        /* required in listener implementation */
      },
      onCues: function (_cues) {
        /* required in listener implementation */
      },
      onMetadata: function (_metadata) {
        /* required in listener implementation */
      },
    });
    if (this.player) {
      this.player.addListener(playerListener);
    }
  }
}
