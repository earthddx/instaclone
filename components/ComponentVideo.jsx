import { useVideoPlayer, VideoView } from "expo-video";
import { File, Paths } from "expo-file-system/next";
import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export default (props) => {
  const { source, isVisible } = props;
  const videoRef = useRef(null);
  const [playUri, setPlayUri] = useState(null);
  // Prevents triggering a download more than once per source
  const downloadAttemptedRef = useRef(false);

  const remoteUri = typeof source === "string"
    ? source.replace("/view?", "/download?")
    : source;

  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
  });

  // Try streaming the remote URL first — works on Android always,
  // and on iOS when the server supports byte-range requests.
  useEffect(() => {
    if (!remoteUri) return;
    const uriStr = typeof remoteUri === "string" ? remoteUri : remoteUri.uri;

    downloadAttemptedRef.current = false;

    // Check if already cached from a previous session
    const file = new File(Paths.cache, hashString(uriStr) + ".mp4");
    setPlayUri(file.exists ? file.uri : uriStr);
  }, [remoteUri]);

  useEffect(() => {
    if (playUri) {
      player.replaceAsync({ uri: playUri });
    }
  }, [playUri, player]);

  // On iOS, AVPlayer errors immediately when the server doesn't support byte-range
  // requests. Catch that here and fall back to a local cached copy.
  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status, error }) => {
      if (status !== "error") return;

      const uriStr = typeof remoteUri === "string" ? remoteUri : remoteUri?.uri;

      const isRemote = playUri && !playUri.startsWith("file://");
      if (!isRemote || downloadAttemptedRef.current || !uriStr) {
        console.error("[ComponentVideo] playback error:", error, "| uri:", playUri);
        return;
      }

      // First error on a remote URL — download to cache and retry
      downloadAttemptedRef.current = true;
      const file = new File(Paths.cache, hashString(uriStr) + ".mp4");

      File.downloadFileAsync(uriStr, file)
        .then((downloaded) => setPlayUri(downloaded.uri))
        .catch((err) => console.warn("[ComponentVideo] cache download failed:", err));
    });
    return () => sub.remove();
  }, [player, remoteUri, playUri]);

  useEffect(() => {
    if (!playUri) return;
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
    return () => {
      try { player.pause(); } catch (_) { }
    };
  }, [isVisible, player, playUri]);

  return (
    <View>
      <VideoView
        ref={videoRef}
        player={player}
        style={{ width: "100%", aspectRatio: 4 / 5 }}
        contentFit="contain"
        nativeControls
      />
    </View>
  );
};
