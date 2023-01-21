import React from "react";

const Background = (props) => {
  return <div className="backdrop" onClick={props.onClose} />;
};
export default Background;