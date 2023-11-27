import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useWindowDimensions from "../utils/Windowdimensions";

function CarouselSkeleton() {
  const { width } = useWindowDimensions();

  return (
    <div
      style={{
        marginBottom: "2rem",
      }}
    >
      <Skeleton
        height={width <= 600 ? "250px" : "300px"}
        baseColor={"#202020"}
        highlightColor={"#333a"}
        borderRadius={width <= 600 ? "0.5rem" : "0.7rem"}
      />
    </div>
  );
}

export default CarouselSkeleton;