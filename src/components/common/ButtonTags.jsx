import React from "react";

const ButtonTags = ({children, text}) => {
    return(
        <button className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition font-medium">
            {children}
            {text}
        </button>
    );
}

export default React.memo(ButtonTags);