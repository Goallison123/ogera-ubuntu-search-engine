import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Auth from "./pages/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/search",
    Component: SearchResults,
  },
  {
    path: "/auth",
    Component: Auth,
  },
]);
