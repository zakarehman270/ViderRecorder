export const ProgressLoader = () => {
    return(
        <div className="h-full w-full  rounded-full bg-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-accent-500 rounded-full w-2/3 h-full animate-progress"></div>              
        </div>
    )
}