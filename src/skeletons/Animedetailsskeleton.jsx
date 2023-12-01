import React from "react";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../utils/Windowdimensions";
import '../styles/Skeletonstyles.css'

function Animedetailsskeleton() {
  const { width } = useWindowDimensions();

  return (
    <div className="detailsskeleton">
      <Skeleton
        height={width <= 600 ? "12rem" : "20rem"}
        baseColor={"#202020"}
        highlightColor={"#333a"}
        style={{
          borderRadius: "0.7rem",
          marginBottom: width <= 600 ? "1rem" : "2rem",
        }}
      />
      <div className="detailscontentskeleton">
        <Skeleton
          baseColor={"#202020"}
          highlightColor={"#333a"}
          count={7}
          style={{
            marginBottom: "1rem",
          }}
        />
      </div>
    </div>
  );
}


export default Animedetailsskeleton;