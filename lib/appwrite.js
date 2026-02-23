import {
  Client,
  Account,
  ID,
  Query,
  Databases,
  Avatars,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
  messagesCollectionId: process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID,
  commentsCollectionId: process.env.EXPO_PUBLIC_COMMENTS_COLLECTION_ID,
  postLikesCollectionId: process.env.EXPO_PUBLIC_POST_LIKES_COLLECTION_ID,
  followsCollectionId: process.env.EXPO_PUBLIC_FOLLOWS_COLLECTION_ID,
  platform: process.env.EXPO_PUBLIC_PLATFORM,
  postsCollectionId: process.env.EXPO_PUBLIC_POSTS_COLLECTION_ID,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageFilesId: process.env.EXPO_PUBLIC_STORAGE_FILES_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_USERS_COLLECTION_ID,
};

const {
  endpoint,
  databaseId,
  messagesCollectionId,
  commentsCollectionId,
  postLikesCollectionId,
  followsCollectionId,
  postsCollectionId,
  projectId,
  platform,
  storageFilesId,
  usersCollectionId,
} = config;

export const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const signIn = async ({ email, password }) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error);
  }
};
export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw new Error(error);
  }
};

export const signUp = async ({ email, password, username }) => {
  console.log(email, password, username);
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn({ email: email, password: password });
    const newUser = await databases.createDocument(
      databaseId,
      usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};
export const getLoggedInUser = async () => {
  try {
    // const { account } = await createSessionClient();
    // return await account.get();
    const currentAccount = await account.get();
    if (!currentAccount) return null;
    const currentUser = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) return null;
    return currentUser.documents[0] ?? null;
  } catch (error) {
    // No active session (guest) — treat as logged out
    return null;
  }
};

export const uploadFile = async ({ file }) => {
  if (!file) return;
  console.log(file);
  const updatedFile = {
    name: file.fileName ?? file.uri.split("/").pop(),
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      storageFilesId,
      ID.unique(),
      updatedFile
    );
    console.log("[uploadedFile]", uploadedFile);
    console.log(
      `[file upload]: ${uploadedFile?.chunksTotal ? "Succesful." : "Failed."}`
    );
    if (file.type.includes("image")) {
      const fileViewUrl = storage.getFileView(
        storageFilesId,
        uploadedFile.$id
      );
      console.log(`[fileViewUrl]: ${fileViewUrl}`);
      return { fileViewUrl: fileViewUrl, type: file.mimeType };
    }
    const fileViewUrl = storage.getFileView(
      storageFilesId,
      uploadedFile.$id
      // width,
      // height,
      // gravity,
      // quality,
    );
    console.log(`[fileViewUrl]: ${fileViewUrl}`);
    return { fileViewUrl: fileViewUrl, type: file.mimeType };
  } catch (error) {
    throw new Error(error);
  }
};

export const createPost = async ({
  file,
  title,
  type,
  description,
  userId,
  thumbnail,
}) => {
  console.log(
    "[Post creation Entries]",
    file,
    title,
    type,
    description,
    userId
  );
  try {
    const data = {
      creator: userId,
      description: description,
      source: file,
      title: title,
      type: type,
    };
    if (thumbnail) data.thumbnail = thumbnail;
    const post = await databases.createDocument(
      databaseId,
      postsCollectionId,
      ID.unique(),
      data
    );
    return post;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, postsCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getPostsPage = async (limit = 10, cursor = null) => {
  try {
    const queries = [Query.orderDesc("$createdAt"), Query.limit(limit)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const result = await databases.listDocuments(
      databaseId,
      postsCollectionId,
      queries
    );
    return {
      documents: result.documents,
      hasMore: result.documents.length === limit,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export async function getUserPosts(userId) {
  if (!userId) return [];
  try {
    const posts = await databases.listDocuments(databaseId, postsCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function likePost(postId, currentLikes, userId) {
  if (currentLikes.includes(userId)) return;
  try {
    const [updated] = await Promise.all([
      databases.updateDocument(databaseId, postsCollectionId, postId, {
        likes: [...currentLikes, userId],
      }),
      databases.createDocument(databaseId, postLikesCollectionId, ID.unique(), {
        userId,
        postId,
      }),
    ]);
    return updated;
  } catch (error) {
    throw new Error(error);
  }
}

export async function unlikePost(postId, currentLikes, userId) {
  try {
    const likeDocs = await databases.listDocuments(databaseId, postLikesCollectionId, [
      Query.equal("userId", userId),
      Query.equal("postId", postId),
      Query.limit(1),
    ]);
    const ops = [
      databases.updateDocument(databaseId, postsCollectionId, postId, {
        likes: currentLikes.filter((id) => id !== userId),
      }),
    ];
    if (likeDocs.documents.length > 0) {
      ops.push(databases.deleteDocument(databaseId, postLikesCollectionId, likeDocs.documents[0].$id));
    }
    const [updated] = await Promise.all(ops);
    return updated;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserLikedPosts(userId) {
  if (!userId) return [];
  try {
    const likeDocs = await databases.listDocuments(databaseId, postLikesCollectionId, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ]);
    if (likeDocs.documents.length === 0) return [];
    const postIds = likeDocs.documents.map((doc) => doc.postId);
    const posts = await databases.listDocuments(databaseId, postsCollectionId, [
      Query.equal("$id", postIds),
      Query.limit(postIds.length),
    ]);
    const postMap = Object.fromEntries(posts.documents.map((p) => [p.$id, p]));
    return postIds.map((id) => postMap[id]).filter(Boolean);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPost(postId) {
  try {
    const post = await databases.getDocument(databaseId, postsCollectionId, postId);
    return post;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePost(postId) {
  try {
    await databases.deleteDocument(databaseId, postsCollectionId, postId);
  } catch (error) {
    throw new Error(error);
  }
}

//Get Messages
export async function getMessages(cursor = null) {
  try {
    const queries = [Query.orderDesc("$createdAt"), Query.limit(30)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const result = await databases.listDocuments(
      databaseId,
      messagesCollectionId,
      queries
    );
    return {
      documents: result.documents,
      hasMore: result.documents.length === 30,
    };
  } catch (error) {
    throw new Error(error);
  }
}

//Get Comment Count
export async function getCommentCount(postId) {
  try {
    const result = await databases.listDocuments(databaseId, commentsCollectionId, [
      Query.equal("postId", postId),
      Query.limit(1),
    ]);
    return result.total;
  } catch {
    return 0;
  }
}

//Get Comments
export async function getComments(postId) {
  try {
    const result = await databases.listDocuments(databaseId, commentsCollectionId, [
      Query.equal("postId", postId),
      Query.orderAsc("$createdAt"),
      Query.limit(100),
    ]);
    return result.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//Add Comment
export async function addComment({ postId, userId, username, avatar, text, parentId = null }) {
  try {
    const doc = await databases.createDocument(
      databaseId,
      commentsCollectionId,
      ID.unique(),
      { postId, userId, username, avatar: avatar ?? null, text, parentId }
    );
    return doc;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFollowingIds(userId) {
  try {
    const result = await databases.listDocuments(databaseId, followsCollectionId, [
      Query.equal("followerId", userId),
      Query.limit(100),
    ]);
    return result.documents.map((doc) => doc.followingId);
  } catch {
    return [];
  }
}

export async function getFollowingPostsPage(followingIds, limit = 10, cursor = null) {
  if (!followingIds || followingIds.length === 0) return { documents: [], hasMore: false };
  try {
    const queries = [
      Query.equal("creator", followingIds),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const result = await databases.listDocuments(databaseId, postsCollectionId, queries);
    return { documents: result.documents, hasMore: result.documents.length === limit };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFollowCounts(userId) {
  try {
    const [followers, following] = await Promise.all([
      databases.listDocuments(databaseId, followsCollectionId, [
        Query.equal("followingId", userId),
        Query.limit(1),
      ]),
      databases.listDocuments(databaseId, followsCollectionId, [
        Query.equal("followerId", userId),
        Query.limit(1),
      ]),
    ]);
    return { followers: followers.total, following: following.total };
  } catch {
    return { followers: 0, following: 0 };
  }
}

export async function checkIsFollowing(followerId, followingId) {
  try {
    const result = await databases.listDocuments(databaseId, followsCollectionId, [
      Query.equal("followerId", followerId),
      Query.equal("followingId", followingId),
      Query.limit(1),
    ]);
    return result.documents.length > 0 ? result.documents[0].$id : null;
  } catch {
    return null;
  }
}

export async function followUser(followerId, followingId) {
  try {
    const doc = await databases.createDocument(
      databaseId,
      followsCollectionId,
      ID.unique(),
      { followerId, followingId }
    );
    return doc.$id;
  } catch (error) {
    throw new Error(error);
  }
}

export async function unfollowUser(followDocId) {
  try {
    await databases.deleteDocument(databaseId, followsCollectionId, followDocId);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserById(userId) {
  try {
    const user = await databases.getDocument(databaseId, usersCollectionId, userId);
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateUser(documentId, { bio, avatar }) {
  const updates = {};
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;
  try {
    const updated = await databases.updateDocument(
      databaseId,
      usersCollectionId,
      documentId,
      updates
    );
    return updated;
  } catch (error) {
    throw new Error(error);
  }
}

//Post Message
export async function postMessage({ message, userId, username, avatar }) {
  try {
    await databases.createDocument(
      databaseId,
      messagesCollectionId,
      ID.unique(),
      {
        text: message,
        userId,
        username,
        avatar: avatar ?? null,
      }
      //permissions???
    );
  } catch (error) {
    throw new Error(error);
  }
}
