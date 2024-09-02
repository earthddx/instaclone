import React from "react";
import { getLoggedInUser } from "../lib/appwrite";
import { UserContext } from "./UserContext";

export default ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const handleSaveUser = (user) => {
    setUser(user);
  };

  React.useEffect(() => {
    getLoggedInUser()
      .then((result) => {
        if (result) {
          handleSaveUser(result);
        } else {
          handleSaveUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        handleSaveUser,
        loading,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
