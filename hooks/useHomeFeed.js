import React from "react";
import { getPostsPage, getFollowingIds, getFollowingPostsPage } from "../lib/appwrite";

const PAGE_SIZE = 10;

export function useHomeFeed(userId) {
  // ── All feed ───────────────────────────────────────────────────────
  const [allPosts, setAllPosts] = React.useState([]);
  const [allHasMore, setAllHasMore] = React.useState(true);
  const [allLoadingMore, setAllLoadingMore] = React.useState(false);
  const allCursorRef = React.useRef(null);
  const allFeedRef = React.useRef(null);

  // ── Following feed ─────────────────────────────────────────────────
  const [followingPosts, setFollowingPosts] = React.useState([]);
  const [followingHasMore, setFollowingHasMore] = React.useState(true);
  const [followingLoadingMore, setFollowingLoadingMore] = React.useState(false);
  const followingCursorRef = React.useRef(null);
  const followingFeedRef = React.useRef(null);
  const followingIdsRef = React.useRef([]);

  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchAllFirstPage = React.useCallback(async () => {
    allCursorRef.current = null;
    const { documents, hasMore } = await getPostsPage(PAGE_SIZE, null);
    setAllPosts(documents);
    setAllHasMore(hasMore);
    if (documents.length > 0) allCursorRef.current = documents[documents.length - 1].$id;
  }, []);

  const fetchFollowingFirstPage = React.useCallback(async () => {
    if (!userId) return;
    followingCursorRef.current = null;
    const ids = await getFollowingIds(userId);
    followingIdsRef.current = ids;
    if (ids.length === 0) {
      setFollowingPosts([]);
      setFollowingHasMore(false);
      return;
    }
    const { documents, hasMore } = await getFollowingPostsPage(ids, PAGE_SIZE, null);
    setFollowingPosts(documents);
    setFollowingHasMore(hasMore);
    if (documents.length > 0) followingCursorRef.current = documents[documents.length - 1].$id;
  }, [userId]);

  React.useEffect(() => {
    Promise.all([fetchAllFirstPage(), fetchFollowingFirstPage()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchAllNextPage = React.useCallback(async () => {
    if (!allHasMore || allLoadingMore) return;
    setAllLoadingMore(true);
    try {
      const { documents, hasMore } = await getPostsPage(PAGE_SIZE, allCursorRef.current);
      setAllPosts((prev) => {
        const seen = new Set(prev.map((p) => p.$id));
        return [...prev, ...documents.filter((p) => !seen.has(p.$id))];
      });
      setAllHasMore(hasMore);
      if (documents.length > 0) allCursorRef.current = documents[documents.length - 1].$id;
    } finally {
      setAllLoadingMore(false);
    }
  }, [allHasMore, allLoadingMore]);

  const fetchFollowingNextPage = React.useCallback(async () => {
    if (!followingHasMore || followingLoadingMore || followingIdsRef.current.length === 0) return;
    setFollowingLoadingMore(true);
    try {
      const { documents, hasMore } = await getFollowingPostsPage(
        followingIdsRef.current,
        PAGE_SIZE,
        followingCursorRef.current
      );
      setFollowingPosts((prev) => {
        const seen = new Set(prev.map((p) => p.$id));
        return [...prev, ...documents.filter((p) => !seen.has(p.$id))];
      });
      setFollowingHasMore(hasMore);
      if (documents.length > 0) followingCursorRef.current = documents[documents.length - 1].$id;
    } finally {
      setFollowingLoadingMore(false);
    }
  }, [followingHasMore, followingLoadingMore]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAllFirstPage(), fetchFollowingFirstPage()]);
    setRefreshing(false);
  }, [fetchAllFirstPage, fetchFollowingFirstPage]);

  return {
    allPosts, allLoadingMore, allFeedRef,
    followingPosts, followingLoadingMore, followingFeedRef, followingIdsRef,
    loading, refreshing,
    fetchAllNextPage, fetchFollowingNextPage, onRefresh,
  };
}
