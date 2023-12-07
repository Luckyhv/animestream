import React from "react";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../utils/Windowdimensions";
import '../styles/Skeletonstyles.css'

function Verticalcardskeleton() {
  const { width } = useWindowDimensions();

  return (
      <div className="">
        <Skeleton
        className="verticalcardskeleton"
          baseColor={"#202020"}
          highlightColor={"#333a"}
          count={7}
          style={{
            marginBottom: "0.5rem",
          }}
        />
      </div>
  );
}


export default Verticalcardskeleton;