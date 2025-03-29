import React from "react";

import SignUp from "../components/Signup";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Groups from "../components/Groups";
import CardListWithTabs from "../components/CardListWithTabs";
import Expenses from "../components/Expenses";
import Balance from "../components/Balance";
import Members from "../components/Members";
import Profile from "../components/Profile";

const pages = [
  { name: "Expenses", content: <Expenses /> },
  { name: "Balance", content: <Balance /> },
  { name: "Members", content: <Members /> },
];

export const routesConfig = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <ProtectedRoute><Groups /></ProtectedRoute>,
  },
  {
    path: "/groups/:groupId/expenses",
    element: <ProtectedRoute><CardListWithTabs header="Expenses" pages={pages} /></ProtectedRoute>,
  },
  {
    path: "/groups/:groupId/balance",
    element: <ProtectedRoute><CardListWithTabs header="Balance" pages={pages} /></ProtectedRoute>,
  },
  {
    path: "/groups/:groupId/members",
    element: <ProtectedRoute><CardListWithTabs header="Members" pages={pages} /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
];
