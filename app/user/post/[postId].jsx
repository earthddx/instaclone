import { useLocalSearchParams } from "expo-router";
import PostDetailScreen from "../../../components/PostDetailScreen";

export default function UserPostDetail() {
  const { postId, creatorId } = useLocalSearchParams();
  return <PostDetailScreen postId={postId} creatorId={creatorId} />;
}
