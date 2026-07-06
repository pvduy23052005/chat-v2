import UserList from "../pages/User";
import AcceptFriend from "../pages/User/AcceptFriend";

const userRoute = {
  path: "user",
  children: [
    { index: true as const, element: <UserList /> },
    { path: "accept-friends", element: <AcceptFriend /> },
  ],
};

export default userRoute;
