import React from 'react'

const Skeleton = () => {
  return (

      <div className={`project skeleton skeletonContainerStyle`}>
        <div className='head-style'>
          <div className="details">
            <div className="title skeleton title-style"></div>
            <p className="skeleton paragraph-style"></p>
          </div>
          <div className='skeleton-links'>
            <span className="skeleton link-style"></span>
            <span className="skeleton link-style"></span>
          </div>
        </div>
        <div className="tag-style">
          <span className="skeleton tag-item"></span>
          <span className="skeleton tag-item"></span>
          <span className="skeleton tag-item"></span>
        </div>
      </div>
  )
}
  

export default Skeleton