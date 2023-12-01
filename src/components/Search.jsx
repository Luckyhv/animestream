import { Fragment, useEffect, useRef, useState,useContext } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import "../styles/Search.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

function Search() {
  const {isopen,setisopen} = useContext(DataContext)
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  let focusInput = useRef(null);

  async function searchdata() {
    setLoading(true);
    const res = await axios.get(
        `https://consumet-anime-api.vercel.app/meta/anilist/advanced-search`,{ params: { query:query,sort:["POPULARITY_DESC","SCORE_DESC","FAVOURITES","TRENDING"] } }
    );
    setData(res.data)
    // console.log(res.data)
    setLoading(false);
  }

  useEffect(() => {
    searchdata();
  }, [query]);

  function closeModal() {
    setisopen(false);
  }

  return (
    <Transition appear show={isopen} as={Fragment}>
      <Dialog
        as="div"
        className="dialogcontainer"
        initialFocus={focusInput}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pageoverlay" />
        </Transition.Child>

        <div className="fixed-overlay">
          <div className="searchcontainer">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="searchdialog">
                <Combobox
                  as="div"
                  className="inputsearchcontainer"
                  onChange={(e) => {
                   navigate(`/info/${e}`);
                   setisopen(false);
                    setData(null);
                    setQuery("");
                  }}
                >
                      <div className="flex-container">
          <div className="quick-access">
            <p className="access-label">For quick access :</p>
            <div className="access-key">CTRL</div>
            <span>+</span>
            <div className="access-key">S</div>
          </div>
          <div className="access-key" style={{margin:"0 5px"}}>Anime</div>
        </div>
                  <div className="searchboxdiv">
                    <Combobox.Input
                      ref={focusInput}
                      className="searchinputbox"
                      placeholder="Search Anime..."
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && data?.results?.length > 0) {
                          navigate(`/advancedsearch/${query}`)
                          setisopen(false);
                          setData(null);
                          setQuery("");
                        }
                      }}
                      autoComplete="off"
                    />
                  </div>
                  <Combobox.Options
                    static
                    className="searchresultoptions"
                  >
                    {!loading ? (
                      <Fragment>
                        {data?.results?.length > 0
                          ? data?.results.map((item) => (
                              <Combobox.Option
                                key={item.id}
                                value={item.id}
                                className={({ active }) =>`searchoptioncontainer ${active? "active":""}`}
                              >
                                <div className="searchimgcon">
                                  <img
                                    src={item.image}
                                    alt="image"
                                    width={52}
                                    height={70}
                                    className="searchimg"
                                  />
                                </div>
                                <div className="searchcontentinfo">
                                  <p className="searchtitle">
                                    {item.title.english || item.title.romaji}
                                  </p>
                                    <span className="searchep">Episodes - {item.totalEpisodes || "Na"}</span>
                                  <div className="sugdetails">
                                            <span><span class="fa fa-star"></span> {item.rating / 10}</span>
                                            <span className='dot'>.</span>
                                            <span>{item.type || "Na"}</span>
                                            <span className='dot'>.</span>
                                            <span> {item.releaseDate || "Na"}</span>
                                            <span className='dot'>.</span>
                                            <span>{item.status}</span>
                                        </div>
                                </div>
                              </Combobox.Option>
                            ))
                          :  
                           (query!=='' &&
                              <p className="" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"15px 0",gap:"3px"}}>
                                No results found.
                              </p>
                            )}
                        {data?.hasNextPage && (
                          <button
                            type="button"
                            onClick={() => {
                             navigate(`/advancedsearch/${query}`)
                             setisopen(false);
                             setQuery("");
                            }}
                            className="viewresults">
                            <span>View Results</span>
                          </button>
                        )}
                      </Fragment>
                    ) : (
                        query!=="" && 
                      <div className="loader">
                        Loading...
                      </div>
                    )}
                  </Combobox.Options>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Search;
