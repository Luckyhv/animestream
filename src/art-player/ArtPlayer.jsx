import Artplayer from "artplayer";
import React, { useRef, useEffect } from "react";

function ArtPlayer({ option, getInstance,thumbnails, skip,...rest }) {
  const artRef = useRef();

  useEffect(() => {

    const art = new Artplayer({
      ...option,
      container: artRef.current,
      highlight: [
        ...(skip?.op
          ? [
              {
                time: skip.op.interval.startTime || 0,
                text: 'Opening',
              },
              {
                time: skip.op.interval.endTime || 0,
                text: 'Opening',
              },
            ]
          : []),
        ...(skip?.ed
          ? [
              {
                time: skip.ed.interval.startTime || 0,
                text: 'Ending',
              },
              {
                time: skip.ed.interval.endTime || 0,
                text: 'Ending',
              },
            ]
          : []),
    ],
      settings: [
        // provider === "gogoanime" &&
        {
          html: "Autoplay Next",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4.05 16.975q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Zm10 0q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Z"></path></svg>',
          tooltip: "ON/OFF",
          switch: localStorage.getItem("autoplay") === "true" ? true : false,
          onSwitch: function (item) {
            // setPlayNext(!item.switch);
            localStorage.setItem("autoplay", !item.switch);
            return !item.switch;
          },
        },
        {
          html: "Autoplay Video",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4.05 16.975q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Zm10 0q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Z"></path></svg>',
          // icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M5.59 7.41L7 6l6 6l-6 6l-1.41-1.41L10.17 12L5.59 7.41m6 0L13 6l6 6l-6 6l-1.41-1.41L16.17 12l-4.58-4.59Z"></path></svg>',
          tooltip: "ON/OFF",
          switch:
            localStorage.getItem("autoplay_video") === "true" ? true : false,
          onSwitch: function (item) {
            setAutoPlay(!item.switch);
            localStorage.setItem("autoplay_video", !item.switch);
            return !item.switch;
          },
        },

      ].filter(Boolean),
      controls: [
        {
          index: 10,
          name: "fast-rewind",
          position: "left",
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M17.959 4.571L10.756 9.52s-.279.201-.279.481s.279.479.279.479l7.203 4.951c.572.38 1.041.099 1.041-.626V5.196c0-.727-.469-1.008-1.041-.625zm-9.076 0L1.68 9.52s-.279.201-.279.481s.279.479.279.479l7.203 4.951c.572.381 1.041.1 1.041-.625v-9.61c0-.727-.469-1.008-1.041-.625z"></path></svg>',
          tooltip: "Backward 5s",
          click: function () {
            art.backward = 5;
          },
        },
        {
          index: 11,
          name: "fast-forward",
          position: "left",
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M9.244 9.52L2.041 4.571C1.469 4.188 1 4.469 1 5.196v9.609c0 .725.469 1.006 1.041.625l7.203-4.951s.279-.199.279-.478c0-.28-.279-.481-.279-.481zm9.356.481c0 .279-.279.478-.279.478l-7.203 4.951c-.572.381-1.041.1-1.041-.625V5.196c0-.727.469-1.008 1.041-.625L18.32 9.52s.28.201.28.481z"></path></svg>',
          tooltip: "Forward 5s",
          click: function () {
            art.forward = 5;
          },
        },
      ],
    });

    art.on("resize", () => {
      art.subtitle.style({
        fontSize: art.height * 0.05 + "px",
      });
    });

    art.on("subtitleUpdate", (text) => {
      art.template.$subtitle.innerHTML = text;
    });

    art.on("ready",()=>{
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
        if (isMobile) {
          // art.controls.remove("theater-button");
          art.controls.remove("fast-rewind");
          // art.controls.remove("fast-forward");
        }
  
    })

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, []);

  return <div ref={artRef} {...rest}></div>;
}

export default ArtPlayer;