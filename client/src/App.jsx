import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateProblem from "./pages/CreateProblem";
import ProblemDetails from "./pages/ProblemDetails";
import EditProblem from "./pages/EditProblem";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

/* Layout wrapper */
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES (no navbar if you want clean login UI) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* APP ROUTES (with navbar) */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <Layout>
              <Leaderboard />
            </Layout>
          }
        />

        <Route
          path="/problem/:id"
          element={
            <Layout>
              <ProblemDetails />
            </Layout>
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateProblem />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditProblem />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;