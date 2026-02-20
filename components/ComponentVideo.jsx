import { useVideoPlayer, VideoView } from "expo-video";
import { File, Paths } from "expo-file-system/next";
import { createDownloadResumable } from "expo-file-system";
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
  const [localUri, setLocalUri] = useState(null);
  const downloadRef = useRef(null);

  const remoteUri = typeof source === "string"
    ? source.replace("/view?", "/download?")
    : source;

  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
  });

  // Download & cache video locally to avoid iOS byte-range request errors
  useEffect(() => {
    if (!remoteUri) return;

    const uriStr = typeof remoteUri === "string" ? remoteUri : remoteUri.uri;
    const cacheKey = hashString(uriStr) + ".mp4";
    const file = new File(Paths.cache, cacheKey);

    let cancelled = false;

    if (file.exists) {
      setLocalUri(file.uri);
    } else {
      const resumable = createDownloadResumable(uriStr, file.uri);
      downloadRef.current = resumable;

      resumable.downloadAsync()
        .then((result) => {
          if (!cancelled && result) setLocalUri(result.uri);
        })
        .catch((err) => {
          if (!cancelled) {
            console.warn("[ComponentVideo] download failed, falling back to remote:", err);
            setLocalUri(uriStr);
          }
        });
    }

    return () => {
      cancelled = true;
      if (downloadRef.current) {
        downloadRef.current.cancelAsync().catch(() => {});
        downloadRef.current = null;
      }
    };
  }, [remoteUri]);

  useEffect(() => {
    if (localUri) {
      player.replace({ uri: localUri });
    }
  }, [localUri, player]);

  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status, error }) => {
      if (status === "error") {
        console.error("[ComponentVideo] error:", error, "| uri:", localUri);
      }
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    if (!localUri) return;
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
    return () => {
      try { player.pause(); } catch (_) { }
    };
  }, [isVisible, player, localUri]);

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
