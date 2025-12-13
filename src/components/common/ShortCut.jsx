import React from "react";

const ShortCut = ({children, text}) =>{
    return(
        <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition flex flex-col items-center justify-center gap-2">
            {children}
            <span className="text-sm font-medium">{text}</span>
        </button>
    );
}

export default React.memo(ShortCut);