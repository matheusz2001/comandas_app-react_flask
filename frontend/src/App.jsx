import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Container } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
      <Container sx={{ mt: 4 }}>
        <ToastContainer position="top-center" autoClose={3000} />
        <Navbar className='Custom-Navbar' />
            <AppRoutes />
        </Container>
      </AuthProvider>

    </BrowserRouter>
  );
}
export default App;