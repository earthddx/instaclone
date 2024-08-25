import { Client, Account, ID, Query } from "react-native-appwrite";

export const config = {
  databaseId: "66c2a94a0026eb9130c9",
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66c26347001ef06d2c36",
  platform: "com.earthddx.instaclone",
  usersCollectionId: "66c2a970000d96eb89ac",
};

const { endpoint, projectId, platform } = config;

export const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);

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
export const signUp = async (email, password, name) => {
  try {
    await account.create(ID.unique(), email, password, name);
    await signIn(email, password);
  } catch (error) {
    throw new Error(error);
  }
};

export const createUser = async ({ email, password, username }) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        // avatar: avatarUrl,
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
