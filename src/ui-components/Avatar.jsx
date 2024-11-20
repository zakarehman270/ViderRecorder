import { useState } from "react"


const getInitials = (name) => {
    const words = name?.trim().split(' ');
    const initials = words?.slice(0, 2).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
};

// Check if the color is dark enough
const isColorDark = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128; // A threshold for determining if the color is dark
};

// Darken the color if it's too light
const darkenColor = (color, factor) => {
    const r = Math.round(parseInt(color.slice(1, 3), 16) * (1 - factor));
    const g = Math.round(parseInt(color.slice(3, 5), 16) * (1 - factor));
    const b = Math.round(parseInt(color.slice(5, 7), 16) * (1 - factor));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};


const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    // Ensure the color is suitable for white text
    if (!isColorDark(color)) {
        color = darkenColor(color, 0.4); // Adjust this factor as needed
    }

    return color;
};


export const Avatar = ({ src, name, size, rounded }) => {

    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        xs: 'w-8 h-8 text-sm',
        sm: 'w-10 h-10 text-sm',
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-lg',
    };

    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const selectedSize = sizeClasses[size] ? size : "md";
    const sizeStyles = sizeClasses[selectedSize];    

    const selectedRound = roundedClasses[rounded] ? rounded : "md";
    const roundedStyles = roundedClasses[selectedRound];    
    
    return(
        <div 
            className={`flex text-white items-center justify-center overflow-hidden select-none ${sizeStyles} ${roundedStyles}`}
            style={{ backgroundColor: stringToColor(name) }}
            >
            {src && !imageError ? (
                <img
                    src={src}
                    alt={name}
                    className="object-cover w-full h-full overflow-hidden"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="text-current">
                     {getInitials(name) || '?'}
                </span>
            )}
        </div>
    )
}