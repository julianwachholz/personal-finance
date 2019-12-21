import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div>
    <h1>Error 404</h1>
    <p>Not found</p>
    <Link to="/">
      <Button type="primary">Go to Dashboard</Button>
    </Link>
  </div>
);

export default NotFound;
