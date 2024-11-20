// bottom-full mb-2 hidden w-max text-sm bg-gray-700 text-white p-2 rounded shadow-lg group-hover:block transition-opacity duration-300
export const Tooltip = ({children, title}) => {
    return(
        <div className="relative group">            
            {children}            
            <div className="absolute w-max text-xs bg-slate-500/80 text-white/80 rounded-md left-full ml-2 py-1 px-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {title}
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-slate-500/80"></div>
            </div>
        </div>
    )
}