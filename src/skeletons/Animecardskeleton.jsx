import React from "react";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../utils/Windowdimensions";

function Animecardskeleton() {
  const { width } = useWindowDimensions();

  const skeletonStyle = {
    width: width <= 600 ? "135px" : "165px",
    height: width <= 600 ? "190px" : "235px",
    borderRadius: "0.5rem",
    margin: "0 10px 4px 10px",
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

export default Animecardskeleton;
