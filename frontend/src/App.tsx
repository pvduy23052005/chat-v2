import "./App.css";
import AllRoute from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <AllRoute />
    </>
  );
}

export default App;
