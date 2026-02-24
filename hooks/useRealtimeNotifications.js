import React from "react";
import { client, config as appwriteConfig } from "../lib/appwrite";
import { getUserPosts, getUserById } from "../lib/appwrite";
import { scheduleLocalNotification } from "./useLocalNotifications";

const { databaseId, followsCollectionId, postLikesCollectionId, commentsCollectionId } = appwriteConfig;

// Returns the Appwrite Realtime channel string for a collection
const channel = (collectionId) =>
  `databases.${databaseId}.collections.${collectionId}.documents`;

// Returns true if the realtime response is a document create event
const isCreate = (response) =>
  response.events.some((e) => e.endsWith(".create"));

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Subscribes to Appwrite Realtime while the app is open.
// Fires a local notification when:
//   - someone follows the current user
//   - someone likes one of the current user's posts
//   - someone comments on one of the current user's posts
//
// Usage: useRealtimeNotifications(user)  — pass the current user object or null
export function useRealtimeNotifications(currentUser) {
  // Set of post IDs that belong to the current user — used for O(1) lookup
  const myPostIdsRef = React.useRef(new Set());

  React.useEffect(() => {
    if (!currentUser?.$id) return;

    // Load the current user's post IDs once so we can filter incoming events
    getUserPosts(currentUser.$id)
      .then((posts) => {
        myPostIdsRef.current = new Set(posts.map((p) => p.$id));
      })
      .catch(() => { });

    // ── New follower ──────────────────────────────────────────────────────────
    const unsubFollows = client.subscribe(
      channel(followsCollectionId),
      async (response) => {
        if (!isCreate(response)) return;
        const doc = response.payload;

        // Only care about follows where the current user is being followed
        if (doc.followingId !== currentUser.$id) return;
        // Don't notify for your own follow (shouldn't happen, but guard anyway)
        if (doc.followerId === currentUser.$id) return;

        try {
          const follower = await getUserById(doc.followerId);
          scheduleLocalNotification({
            title: "New follower",
            body: `@${follower.username} started following you`,
            data: { route: `/user/${doc.followerId}` },
          });
        } catch { }
      }
    );

    // ── New like on your post ─────────────────────────────────────────────────
    const unsubLikes = client.subscribe(
      channel(postLikesCollectionId),
      async (response) => {
        if (!isCreate(response)) return;
        const doc = response.payload;

        // Only care about likes on the current user's posts
        if (!myPostIdsRef.current.has(doc.postId)) return;
        // Don't notify for your own like
        if (doc.userId === currentUser.$id) return;

        try {
          const liker = await getUserById(doc.userId);
          scheduleLocalNotification({
            title: "New like",
            body: `@${liker.username} liked your post`,
            data: { route: `/post/${doc.postId}` },
          });
        } catch { }
      }
    );

    // ── New comment on your post ──────────────────────────────────────────────
    const unsubComments = client.subscribe(
      channel(commentsCollectionId),
      async (response) => {
        if (!isCreate(response)) return;
        const doc = response.payload;

        // Only care about comments on the current user's posts
        if (!myPostIdsRef.current.has(doc.postId)) return;
        // Don't notify for your own comment
        if (doc.userId === currentUser.$id) return;

        scheduleLocalNotification({
          title: "New comment",
          body: `@${doc.username}: ${doc.text.slice(0, 80)}`,
          data: { route: `/post/${doc.postId}` },
        });
      }
    );

    return () => {
      unsubFollows();
      unsubLikes();
      unsubComments();
    };
  }, [currentUser?.$id]);
}
