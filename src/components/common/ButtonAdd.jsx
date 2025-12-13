import React from "react";
const ButtonAdd = ({ children, text, color }) => {
  const BASE = "px-4 py-2.5 text-white rounded-lg font-medium flex items-center gap-2 transition";

  const COLORS = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    green: "bg-green-600 hover:bg-green-700",
  };

  const whichColor = () => {
    return `${BASE} ${COLORS[color] || COLORS.blue}`;
  };

  return (
    <button className={whichColor()}>
      {children}
      {text}
    </button>
  );
};

export default React.memo(ButtonAdd);
