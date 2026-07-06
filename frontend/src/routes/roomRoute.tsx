import Detail from "../pages/Room/Detail";
import Create from "../pages/Room/Create";
import AddMember from "../components/room/AddMember";

const roomRoute = {
  path: "room",
  children: [
    { path: "detail/:id", element: <Detail /> },
    { path: "create", element: <Create /> },
    { path: "add-member/:id", element: <AddMember /> },
  ],
};

export default roomRoute;
