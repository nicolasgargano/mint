import { Route } from "wouter"
import React from "react"
import { Playground } from "./pages/Playground"
import { Home } from "./pages/Home"

export const App = () => {
  return (
    <>
      <Route path="/">
        <Home />
      </Route>

      <Route path="/playground">
        <Playground />
      </Route>
    </>
  )
}
