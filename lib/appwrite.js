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
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async ({ file }) => {
  if (!file) return;
  console.log(file);
  const updatedFile = {
    name: file.fileName,
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
    if(file.type.includes("image")){
      const fileViewUrl = storage.getFilePreview(
        storageFilesId,
        uploadedFile.$id,
        // width,
        // height,
        // gravity,
        // quality,
      );
      console.log(`[filePreViewUrl]: ${fileViewUrl}`);
      return { fileViewUrl: fileViewUrl, type: file.mimeType };
    }
    const fileViewUrl = storage.getFileView(
      storageFilesId,
      uploadedFile.$id,
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

export const createPost = async ({ file, title, type, description, userId }) => {
  console.log("[Post creation Entries]", file, title,type, description, userId);
  try {
    const post = await databases.createDocument(
      databaseId,
      postsCollectionId,
      ID.unique(),
      {
        creator: userId,
        description: description,
        source: file,
        title: title,
        type: type,
      }
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
    // console.log(posts.documents)
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

//Get Messages
export async function getMessages() {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      messagesCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(100)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//Post Message
export async function postMessage({ message, userId, username, timestamp }) {
  try {
    await databases.createDocument(
      databaseId,
      messagesCollectionId,
      ID.unique(),
      {
        text: message,
        userId,
        username,
        timestamp,
      }
      //permissions???
    );
  } catch (error) {
    throw new Error(error);
  }
}
