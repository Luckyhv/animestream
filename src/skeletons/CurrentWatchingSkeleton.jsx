import React from "react";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../utils/Windowdimensions";

function CurrentWatchingSkeleton() {
  const { width } = useWindowDimensions();

  const skeletonStyle = {
    width: width <= 600 ? "250px" : "350px",
    height: width <= 600 ? "160px" : "210px",
    borderRadius: "0.75rem",
    margin: "15px 5px 15px 5px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        overflow: "hidden",
      }}
    >
      {[...Array(8)].map((x, i) => (
        <div key={i} style={{ flex: "0 1", width: "100%" }}>
          <Skeleton style={skeletonStyle} baseColor="#202020" highlightColor={"#333a"}/>
          {/* <Skeleton
            width={width <= 600 ? "120px" : "160px"}
            baseColor={"#202020"}
            highlightColor={"#333a"}
          /> */}
        </div>
      ))}
    </div>
  );
}

export default CurrentWatchingSkeleton;
