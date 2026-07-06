import Chat from "../pages/Chat";

const chatRoute = {
  path: "chat",
  children: [
    { index: true as const, element: <Chat /> },
    { path: "not-friend", element: <Chat /> },
  ],
};

export default chatRoute;
