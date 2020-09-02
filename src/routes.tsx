import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Home from "./pages/Home";
import Details from "./pages/Details";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/details" component={Details} />
    </BrowserRouter>
  );
};

export default Router;
