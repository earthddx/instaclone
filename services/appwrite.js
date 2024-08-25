import { Client, Account, ID } from "react-native-appwrite";

export const config = {
  databaseId: "66c2a94a0026eb9130c9",
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66c26347001ef06d2c36",
  platform: "com.earthddx.instaclone",
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
    await signin(email, password);
  } catch (error) {
    throw new Error(error);
  }
};
