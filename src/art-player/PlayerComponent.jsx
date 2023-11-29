import React, { useEffect, useState, useContext } from "react";
import ArtPlayer from "./ArtPlayer";
import Hls from "hls.js";
import { icons } from "./Overlay";
import axios from "axios";
import { DataContext } from '../context/DataContext';
import Watchplayerskeleton from "../skeletons/Watchplayerskeleton";

function PlayerComponent({ epid,epnum,provider,subtype }) {
  const { data,anifybanner } = useContext(DataContext);
  const [epSource, setEpSource] = useState(null);
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState({});
  const [aspectRatio,setAspectRatio] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  // const [thumbnails,setthumbnails] = useState("");

   function calculateAspectRatio(width, height) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const aspectRatio = `${width / divisor}/${height / divisor}`;
    return aspectRatio;
  }

  const fetchSource = async () => {
    setLoading(true);
    window.scrollTo(0, 0);
  //   if(provider==="gogoanime"){
  //   try {
  //     // Fetch source data
  //     const { data: sourceData } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}meta/anilist/watch/${epid}`);
  //     setEpSource(sourceData);
  //     console.log(sourceData.sources);
  //     sourceData.sources &&
  //       sourceData.sources.map((source) => {
  //         if (source.quality === "720p") {
  //           setUri(source.url);
  //         }
  //       });
  //       // subtitle
  //       if (sourceData.subtitles) {
  //         const englishSubtitle = sourceData.subtitles.map((subtitle) => subtitle.lang === "English");
  //         setSubtitle(englishSubtitle ? englishSubtitle.url : "");
  //       } else {
  //         setSubtitle("");
  //       }
  //   } catch (error) {
  //     setError(`Error fetching source data: ${error.message}`);
  //   }
  // }
    try {
      const { data: sourceData } = await axios.get(
        `https://api.anify.tv/sources?providerId=${provider}&watchId=${encodeURIComponent(epid)}
        &episodeNumber=${epnum}&id=${data.id}&subType=${subtype}`
      );
      setEpSource(sourceData);
      console.log(sourceData);
      sourceData.sources &&
        sourceData.sources.map((source) => {
          if (source.quality === "720p") {
            setUri(source.url);
          }
        });

     // subtitle
     if (sourceData && sourceData.subtitles.length>0) {
      const englishSubtitle = sourceData.subtitles.find((subtitle) => subtitle.lang === "English");
      if (englishSubtitle) {
        setSubtitle(englishSubtitle.url);
      }
    }
      else {
      setSubtitle("");
    }
        
        if (sourceData) {
          const op = {
             interval:{
            startTime: sourceData.intro.start,
            endTime: sourceData.intro.end,
          }};  
          const ed = {
            interval:{
            startTime: sourceData.outro.start,
            endTime: sourceData.outro.end,
          }
        };
        
          setSkip({
            op: op,
            ed: ed,
          });
        }

    //  thumbnails
    // sourceData.subtitles &&
    //     sourceData.subtitles.map((thumbnail) => {
    //       if (thumbnail.lang === "thumbnails" || thumbnail.lang === "Thumbnails") {
    //         setthumbnails(thumbnail.url);
    //       }
    //     });
    } catch (error) {
      return { error: error.message, status: error.response };
    }
  
    // try {
    //   // Fetch skip details
    //   const response = await axios.get(
    //     `https://api.aniskip.com/v2/skip-times/${data.id}/${parseInt(epnum)}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
    //   );

    //   const skipdetails = response.data;
    //   console.log(skipdetails)
    //   const op =
    //     skipdetails?.results?.find((item) => item.skipType === "op") || null;
    //   const ed =
    //     skipdetails?.results?.find((item) => item.skipType === "ed") || null;
  
    //   setSkip({
    //     op,
    //     ed,
    //   });
    // } catch (error) {
    //   setSkip({
    //     op: null,
    //     ed: null,
    //   })
    // } 
    finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSource();
  }, [epid, epnum,provider,subtype]);

  let options = {
    container: ".artplayer-app",
    url: uri,
    customType: {
      m3u8: function playM3u8(video, url, art) {
        if (Hls.isSupported()) {
    if (art.hls) art.hls.destroy();
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    art.hls = hls;
    art.on('destroy', () => hls.destroy());
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else {
            art.notice.show = 'Unsupported playback format: m3u8';
        }
    }
    },
    title: data.title.english,
    poster: anifybanner,
    volume: 1,
    isLive: false,
    autoplay: false,
    autoOrientation: true,
    pip: true,
    autoSize: false,
    autoMini: false,
    screenshot: false,
    setting: true,
    loop: false,
    // Lock: true,
    muted: false,
    icons: icons,
    playbackRate: true,
    fullscreen: true,
    subtitleOffset: false,
    miniProgressBar: true,
    mutex: true,
    backdrop: true,
    playsInline: true,
    autoPlayback: true,
    airplay: true,
    whitelist: ["*"],
    moreVideoAttr: {
      crossOrigin: "anonymous",
    },
    quality:
      epSource && epSource.sources
        ? epSource.sources.map((source) => ({
          default: source.quality === "720p" || source.quality === "auto",
          html: source.quality,
          url: source.url,
        }))
        : [],
    subtitle: {
        url: subtitle,
          style: {
            // color: "#fff",
          },
          encoding: "utf-8",
        },
      //   thumbnails: {
        //     number: 60,
        //     column: 10,
      //     url: thumbnails,
      //     type:'vtt',
      // },
};

function getInstance(art) {
  art.on("ready",()=>{
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (isMobile) {
        // art.controls.remove("theater-button");
        art.controls.remove("fast-rewind");
        // art.controls.remove("fast-forward");
      }

  })
    art.on("video:timeupdate", () => {
        var currentTime = art.currentTime;
        // console.log(art.currentTime);
  
        if (
          skip?.op &&
          currentTime >= skip.op.interval.startTime &&
          currentTime <= skip.op.interval.endTime
        ) {
          // Add the layer if it's not already added
          if (!art.controls["op"]) {
            // Remove the other control if it's already added
            if (art.controls["ed"]) {
              art.controls.remove("ed");
            }
  
            // Add the control
            art.controls.add({
              name: "op",
              position: "top",
              html: '<div class="vid-con"><button class="skip-button" >Skip Opening</button></div>',
              click: function (...args) {
                art.seek = skip.op.interval.endTime;
              },
            });
          }
        } else if (
          skip?.ed &&
          currentTime >= skip.ed.interval.startTime &&
          currentTime <= skip.ed.interval.endTime
        ) {
          // Add the layer if it's not already added
          if (!art.controls["ed"]) {
            // Remove the other control if it's already added
            if (art.controls["op"]) {
              art.controls.remove("op");
            }
  
            // Add the control
            art.controls.add({
              name: "ed",
              position: "top",
              html: '<div class="skip-conend"><button class="skip-button" >Skip Ending</button></div>',
              click: function (...args) {
                art.seek = skip.ed.interval.endTime;
              },
            });
          }
        } else {
          // Remove the controls if they're added
          if (art.controls["op"]) {
            art.controls.remove("op");
          }
          if (art.controls["ed"]) {
            art.controls.remove("ed");
          }
        }
      });
      art.on("video:loadedmetadata", () => {
        // get raw video width and height
        // console.log(art.video.videoWidth, art.video.videoHeight);
        const aspect = calculateAspectRatio(
          art.video.videoWidth,
          art.video.videoHeight
        );
        setAspectRatio(aspect);
      });

      art.on("video:ended", () => {
        // if (!track?.next) return;
        if (localStorage.getItem("autoplay") === "true") {
          art.controls.add({
            name: "next-button",
            position: "top",
            html: '<div class="vid-con"><button class="next-button progress">Play Next</button></div>',
            click: function (...args) {
              // if (track?.next) {
              //   router.push(
              //     `/`
              //   );
              // }
            },
          });
        }});
  
}

return loading ? (
<Watchplayerskeleton/>
  ) : (
  <ArtPlayer
    option={options}
    // key={uri}
    // thumbnails={thumbnails}
    className=""
    style={{
      width: "100%",
      height: "100%",
      aspectRatio:`${aspectRatio}`,
    }}
    getInstance={getInstance}
    skip={skip}
  />
);
}
export default PlayerComponent;
