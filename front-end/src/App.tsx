import React from "react";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Video from "./pages/Video";
import { ModalProvider } from "./context/authentication_modal_context";
import { LoadingProvider } from "./context/loading_context";
import { SnackProvider } from "./context/snack_context";
import { UserDataProvider } from "./context/user_data_context";
import { Upload } from "./pages/Upload";
import { Profile } from "./pages/Profile";
import { createTheme, ThemeProvider } from "@mui/material";
import { Following } from "./pages/Following";
import { Home } from "./pages/Home";
import { Edit } from "./pages/Edit";
import { Search } from "./pages/Search";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <SnackProvider>
          <UserDataProvider>
            <ModalProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/video/:id" element={<Video />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/edit/:id" element={<Edit />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/profile/:email" element={<Profile />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
              </Layout>
            </ModalProvider>
          </UserDataProvider>
        </SnackProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
