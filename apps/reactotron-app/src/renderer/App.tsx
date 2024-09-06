import React, { useEffect } from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import styled from "styled-components"

import SideBar from "./components/SideBar"
import Footer from "./components/Footer"
import RootContextProvider from "./contexts"
import RootModals from "./RootModals"

import Home from "./pages/home"
import Timeline from "./pages/timeline"
import Overlay from "./pages/reactNative/Overlay"
import Storybook from "./pages/reactNative/Storybook"
import CustomCommands from "./pages/customCommands"
import Help from "./pages/help"
import StateIndex from "./pages/state"
import Snapshots from "./pages/state/Snapshots"
import Subscriptions from "./pages/state/Subscriptions"
import Store from "./pages/state/Store"
import "./tailwind.css"
import Storage from "./pages/state/Storage"
import NetworkPage from "./pages/network"
import { ThemeProvider, createTheme } from "@mui/material/styles"

const AppContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
`

const TopSection = styled.div`
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

function App() {
  useEffect(() => {
    const theme = "dark"
    document.documentElement.setAttribute("data-mui-color-scheme", theme)
    document.documentElement.setAttribute("data-joy-color-scheme", theme)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <RootContextProvider>
          <AppContainer>
            <TopSection>
              <SideBar />

              <MainContainer>
                <Routes>
                  {/* Home */}
                  <Route path="/" element={<Home />} />

                  {/* Timeline */}
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/network" element={<NetworkPage />} />

                  {/* State */}
                  <Route path="/state" element={<StateIndex />}>
                    <Route path="/state/store" index element={<Store />} />
                    <Route path="/state/storage" element={<Storage />} />
                    <Route path="/state/snapshots" element={<Snapshots />} />
                    <Route path="/state/subscriptions" element={<Subscriptions />} />
                  </Route>

                  {/* React Native */}
                  <Route path="/native/overlay" element={<Overlay />} />
                  <Route path="/native/storybook" element={<Storybook />} />

                  {/* Custom Commands */}
                  <Route path="/customCommands" element={<CustomCommands />} />

                  {/* Help */}
                  <Route path="/help" element={<Help />} />
                </Routes>
              </MainContainer>
            </TopSection>
            <Footer />
          </AppContainer>
          <RootModals />
        </RootContextProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
