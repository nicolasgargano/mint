import { Route } from "wouter"
import React from "react"
import { Playground } from "./pages/Playground"
import { Home } from "./pages/Home"
import { Noise } from "./pages/Noise"

export const App = () => {
  return (
    <>
      <Route path="/">
        <Home />
      </Route>

      <Route path="/playground">
        <Playground />
      </Route>

      <Route path="/noise">
        <Noise />
      </Route>
    </>
  )
}
