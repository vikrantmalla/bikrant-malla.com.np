import React from "react";

interface Props {
  onClose: () => void;
}

const Background = ({ onClose }: Props) => {
  return <div className="backdrop" onClick={onClose} />;
};
export default Background;
