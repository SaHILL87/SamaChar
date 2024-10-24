import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Dashboard,
  HomeLayout,
  Landing,
  Login,
  Logout,
  Register,
} from "./pages";
import { ToastContainer, toast } from "react-toastify";
import Articles from "./pages/ArticleList";
import ArticleDetails from "./pages/ArticlePage";
import Profile from "./pages/Profile";
import LikedArticles from "./pages/LikedArticles";
import NewsDashboard from "./pages/Latestnews";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "articles",
        element: <Articles />,
      },
      {
        path: "article/:id",
        element: <ArticleDetails />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "liked-articles",
        element: <LikedArticles />,
      },
      {
        path: "latest-news",
        element: <NewsDashboard />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
