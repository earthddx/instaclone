import {
  Client,
  Account,
  ID,
  Query,
  Databases,
  Avatars,
} from "react-native-appwrite";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
  platform: process.env.EXPO_PUBLIC_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageFilesId: process.env.EXPO_PUBLIC_STORAGE_FILES_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_USERS_COLLECTION_ID,
};

const { endpoint, projectId, platform } = config;

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
export const signOut = async (email, password) => {
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
      config.databaseId,
      config.usersCollectionId,
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
      config.databaseId,
      config.usersCollectionId,
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
  try {
    const promise = await storage.createFile(
      config.storageFilesId,
      ID.unique(),
      file
    );
    console.log("[file upload]: ", promise);
  } catch (error) {
    throw new Error(error);
  }
};
