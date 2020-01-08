import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import useTitle from "../../utils/useTitle";

const NotFound = () => {
  useTitle(`Error 404`);
  return (
    <div>
      <h1>Error 404</h1>
      <p>Not found</p>
      <Link to="/">
        <Button type="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
