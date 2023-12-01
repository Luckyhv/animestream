import React from "react";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../utils/Windowdimensions";
import "../styles/Skeletonstyles.css"; // Import your CSS file

function Watchplayerskeleton() {
  const { width } = useWindowDimensions();

  return (
    <div>
      <div className="playerwrapper">
        <div>
          <Skeleton
            baseColor={"#202020"}
            highlightColor={"#333a"}
            style={{
              marginBottom: "0rem",
              aspectRatio: width <= 600 ? "16 /9.5" : "16 / 9",
            }}
          />
          {/* <Skeleton
            height={40}
            baseColor={"#202020"}
            highlightColor={"#333a"}
            style={{
              marginBottom: "1rem",
            }}
          /> */}
        </div>
        {/* <div className="playerepisodes-wrapper">
          <p>Episodes</p>
          <div className="episodes">
            {[...Array(20)].map((x, i) => (
              <div key={i}>
                <Skeleton
                  width={"3rem"}
                  height={45}
                  borderRadius={"0.4rem"}
                  baseColor={"#202020"}
                  highlightColor={"#333a"}
                />
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Watchplayerskeleton;
