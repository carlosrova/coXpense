// routes/routes.jsx
import React from "react";
import { Route } from "react-router-dom";
import { routesConfig } from "./config";

export const appRoutes = routesConfig.map((route, index) => (
  <Route key={index} path={route.path} element={route.element} />
));
