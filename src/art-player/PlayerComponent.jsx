import React, { useEffect, useState, useContext } from "react";
import ArtPlayer from "./ArtPlayer";
import Hls from "hls.js";
import { icons } from "./Overlay";
import axios from "axios";
import { DataContext } from '../context/DataContext';
import Watchplayerskeleton from "../skeletons/Watchplayerskeleton";
import {useNavigate} from 'react-router-dom'

function PlayerComponent({ epid,epnum,provider,subtype,nexttrack,eptitle }) {
  const { data, anifybanner, playerState, setPlayerState } = useContext(DataContext);
  const [epSource, setEpSource] = useState(null);
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState({});
  const [aspectRatio,setAspectRatio] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  const navigate = useNavigate();
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
        
     if(provider!=="gogoanime"){
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
  
    try {
      // Fetch skip details
      if (provider==="gogoanime") {
        const response = await axios.get(
        `https://api.aniskip.com/v2/skip-times/${data.malId}/${parseInt(epnum)}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
      );

      const skipdetails = response.data;
      console.log(skipdetails)
      const op =
        skipdetails?.results?.find((item) => item.skipType === "op") || null;
      const ed =
        skipdetails?.results?.find((item) => item.skipType === "ed") || null;
  
      setSkip({
        op,
        ed,
      });
    }
    } catch (error) {
      setSkip({
        op: null,
        ed: null,
      })
    } 
    finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSource();
  }, [epid, epnum,provider,subtype]);


function getInstance(art) {
  art.on("ready",()=>{
    const autoplayv = localStorage.getItem("autoplay_video") || false;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (isMobile) {
        art.controls.remove("fast-rewind");
        // art.controls.remove("fast-forward");
      }

      if (autoplayv === "true" || autoplayv === true) {
        if (playerState.currentTime === 0) {
          art.play();
        } else {
          if (playerState.isPlaying) {
            art.play();
          } else {
            art.pause();
          }
        }
      } else {
        if (playerState.isPlaying) {
          art.play();
        } else {
          art.pause();
        }
      }
      art.seek = playerState.currentTime;
  })

  art.on("ready", () => {
    if (playerState.currentTime !== 0) return;
    const seek = art.storage.get(data.id);
    if(seek.epid===epid){
      console.log(seek.epid)
    const seekTime = seek?.timeWatched || 0;
    const duration = art.duration;
    const timeWatched=seek?.timeWatched
    const percentage = seekTime / duration;
    const percentagedb = timeWatched / duration;

    if (percentage >= 0.9 || percentagedb >= 0.9) {
      art.currentTime = 0;
      console.log("Video started from the beginning");
    } else if (timeWatched) {
      art.currentTime = timeWatched-5;
    } else {
      art.currentTime = seekTime;
    }
  }
  });

  art.on("play", () => {
    art.notice.show = "";
    setPlayerState({ ...playerState, isPlaying: true });
  });
  art.on("pause", () => {
    art.notice.show = "";
    setPlayerState({ ...playerState, isPlaying: false });
  });

  art.on("video:playing", () => {
    const interval = setInterval(async () => {
      art.storage.set(data.id, {
        id: String(data.id),
        epid: epid,
        title: eptitle,
        aniTitle: data.title?.english || info.title?.romaji,
        image: anifybanner || null,
        episode: epnum,
        duration: art.duration,
        timeWatched: art.currentTime,
        provider: provider,
        nextId: nexttrack.nextepisodeid || null,
        nextNumber: nexttrack.nextEpisodeNumber || null,
        subtype: subtype,
        createdAt: new Date().toISOString(),
      });
    }, 5000);

    art.on("video:pause", () => {
      clearInterval(interval);
    });

    art.on("video:ended", () => {
      clearInterval(interval);
    });

    art.on("destroy", () => {
      clearInterval(interval);
    });
  });

    art.on("video:timeupdate", () => {
        var currentTime = art.currentTime;
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
        const aspect = calculateAspectRatio(
          art.video.videoWidth,
          art.video.videoHeight
        );
        setAspectRatio(aspect);
      });

      art.on("video:ended", () => {
        if (!nexttrack?.nextEpisodeNumber) return;
        if (localStorage.getItem("autoplay") === "true") {
          art.controls.add({
            name: "next-button",
            position: "top",
            html: '<div class="vid-con"><button class="next-button progress"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> Next Episode</button></div>',
            click: function (...args) {6
              if (nexttrack?.nextEpisodeNumber) {
                navigate(`/watch/${data.id}/${provider}/${encodeURIComponent(nexttrack.nextepisodeid)}/${nexttrack.nextEpisodeNumber}/${subtype}`);
              }
            },
          });
        }
        const button = document.querySelector(".next-button");

        function stopTimeout() {
          clearTimeout(timeoutId);
          button.classList.remove("progress");
        }

        let timeoutId = setTimeout(() => {
          art.controls.remove("next-button");
          if (nexttrack?.nextEpisodeNumber) {
            navigate(`/watch/${data.id}/${provider}/${encodeURIComponent(nexttrack.nextepisodeid)}/${nexttrack.nextEpisodeNumber}/${subtype}`);   
          }
        }, 7000);
        button.addEventListener("mouseover", stopTimeout);
      });
}

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
  Lock: true,
  muted: false,
  icons: icons,
  playbackRate: true,
  fullscreen: true,
  subtitleOffset: false,
  miniProgressBar: false,
  mutex: true,
  backdrop: true,
  playsInline: true,
  autoPlayback: true,
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
      aspectRatio:`16/9`,
    }}
    getInstance={getInstance}
    skip={skip}
  />
);
}
export default PlayerComponent;
