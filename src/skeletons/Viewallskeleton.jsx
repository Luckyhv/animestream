import React from 'react'
import Skeleton from 'react-loading-skeleton';
import useWindowDimensions from '../utils/Windowdimensions';
import "react-loading-skeleton/dist/skeleton.css";

function Viewallskeleton() {
    const { width } = useWindowDimensions();

  return (
    <>
       {[...Array(10)].map((x, i) => (
          <div key={i} className='skeletonitem'>
            <Skeleton
              width={width <= 600 ? '135px' : '165px'}
              height={width <= 600 ? '190px' : '235px'}
              borderRadius={width <= 600 ? '0.3rem' : '0.5rem'}
              baseColor={'#202020'}
              highlightColor={'#333a'}
            />
          </div>
        ))}
    </>
  )
}

export default Viewallskeleton
