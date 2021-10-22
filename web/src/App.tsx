import { Route } from "wouter"
import React from "react"
import { Home } from "./pages/Home"

export const App = () => {
  return (
    <>
      <Route path="/">
        <Home />
      </Route>
    </>
  )
}
