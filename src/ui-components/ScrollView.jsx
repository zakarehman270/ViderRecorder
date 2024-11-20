import { useRef } from 'react'

export const ScrollView = ({children}) => {

    const scrollContainerRef = useRef(null);

    const handleMouseDown = (e) => {
        scrollContainerRef.current.isDown = true;
        scrollContainerRef.current.startX = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollContainerRef.current.scrollLeftAtStart = scrollContainerRef.current.scrollLeft; // Keep the initial scroll position
        scrollContainerRef.current.classList.add('cursor-grabbing');
    };

    const handleMouseLeave = () => {
        scrollContainerRef.current.isDown = false;
        scrollContainerRef.current.classList.remove('cursor-grabbing');
    };

    const handleMouseUp = () => {
        scrollContainerRef.current.isDown = false;
        scrollContainerRef.current.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
        if (!scrollContainerRef.current.isDown) return; // Stop the function if not dragging
        e.preventDefault();
        

        // Calculate how far the mouse has moved
        const x = e.pageX - scrollContainerRef.current.offsetLeft;

        console.log('X', x)
        const walk = (x - scrollContainerRef.current.startX) * 2; // The multiplier controls the scroll speed
        console.log('Walk', walk)
        // Update scroll position based on mouse movement
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollLeftAtStart - walk;
    };

    return(
        <div className="overflow-hidden h-full relative">
            <div
                ref={scrollContainerRef}
                className="horizontal-scroll-container flex space-x-1 px-4 py-2 cursor-grab overflow-x-scroll"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ scrollbarWidth: 'none' }} // For Firefox
                // ="scroll-container"
            >
               {children}
            </div>
            <div className="absolute left-0 top-0  w-10 h-full bg-gradient-to-r from-white to-transparent" />
            <div className="absolute right-0 top-0  w-10 h-full bg-gradient-to-r from-transparent to-white" />
        </div>
    )
}