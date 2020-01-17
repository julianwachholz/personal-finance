import { Button, Result } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const NotFound = () => {
  const location = useLocation();
  useTitle(`Error 404`);
  return (
    <BaseModule title="Error 404">
      <Result
        status="404"
        title="Not Found"
        subTitle={`We looked everywhere but couldn't find "${location.pathname}".`}
        extra={
          <Link to="/">
            <Button type="primary">Go to Dashboard</Button>
          </Link>
        }
      />
    </BaseModule>
  );
};

export default NotFound;
