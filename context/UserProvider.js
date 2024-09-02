import React from "react";
import { getLoggedInUser } from "../lib/appwrite";
import { UserContext } from "./UserContext";

export default ({ children }) => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getLoggedInUser()
      .then((result) => {
        if (result) {
          setIsLogged(true);
          setUser(result);
        } else {
          setIsLogged(false);
          setUser(null);
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
        isLogged,
        loading,
        setIsLogged,
        setUser,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
