import React from "react";
import { Flex, Skeleton, Space } from "antd";

export default function TableSkeleton() {
  return (
    <div className="column-a">
      <div className="row">
        <Skeleton.Input style={{ width: "300px" }} />
      </div>
      <Skeleton.Input style={{ width: "1100px", height: "100px" }} />
    </div>
  );
}
