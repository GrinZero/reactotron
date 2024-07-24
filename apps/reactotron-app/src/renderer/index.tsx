/* eslint-disable react/no-deprecated */
import "v8-compile-cache"
import React from "react"
import ReactDOM from "react-dom"
import { ReactotronAppProvider } from "reactotron-core-ui"

import "./global.css"

import App from "./App"

ReactDOM.render(
  <ReactotronAppProvider>
    <App />
  </ReactotronAppProvider>,
  document.getElementById("app")
)

if ((module as any).hot) {
  ;(module as any).hot.accept()
}
