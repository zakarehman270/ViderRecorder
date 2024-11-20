import { Spinner } from ".";

export const IconButton = ({ 
    color = "primary", 
    size = "md", 
    variant = "solid", 
    isLoading, 
    isDisabled, 
    children,
    rounded,
    ...rest 
}) => {

    const baseStyles = `group leading-tight flex items-center justify-center text-center transition-all duration-300 ease-in-out  font-medium`;
    const disabledStyles = 'disabled:border-transparent disabled:text-slate-400 disabled:hover:text-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed';

    const sizeClasses = {
        sm: 'w-9 h-9 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
    };

    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };


    // Use template literals for known color values
    const variantClasses = {    
        primary: {
            solid: `bg-primary-500 text-white hover:bg-primary-600`,
            outline: `border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white`,
            subtle: `bg-primary-100 text-primary-700 hover:bg-primary-200`,        
        },
        accent: {
            solid: `bg-accent-500 text-white hover:bg-accent-600`,
            outline: `border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white`,
            subtle: `bg-accent-100 text-accent-700 hover:bg-accent-200`,        
        },
        slate: {
            solid: `bg-slate-400 text-white hover:bg-slate-500`,
            outline: `border border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-white`,
            subtle: `bg-slate-50 text-slate-600 hover:bg-slate-200`,        
        },
        error: {
            solid: `bg-error-500 text-white hover:bg-error-600`,
            outline: `border border-error-500 text-error-500 hover:bg-error-500 hover:text-white`,
            subtle: `bg-red-100 text-error-700 hover:bg-error-200`,        
        },
        success: {
            solid: `bg-success-500 text-white hover:bg-success-600`,
            outline: `border border-success-500 text-success-500 hover:bg-success-500 hover:text-white`,
            subtle: `bg-green-100 text-success-700 hover:bg-success-200`,        
        },
        warning: {
            solid: `bg-warning-500 text-white hover:bg-warning-600`,
            outline: `border border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white`,
            subtle: `bg-warning-100 text-warning-700 hover:bg-warning-200`,        
        },
        info: {
            solid: `bg-info-500 text-white hover:bg-info-600`,
            outline: `border border-info-500 text-info-500 hover:bg-info-500 hover:text-white`,
            subtle: `bg-info-100 text-info-700 hover:bg-info-200`,        
        },
        
    };

    // Construct final styles by ensuring all classes are correctly referenced
    // Handle fallback for color
    const selectedColor = variantClasses[color] ? color : "slate";

    // Handle fallback for variant
    const selectedVariant = variantClasses[selectedColor][variant] ? variant : "solid";

    const variantStyles = variantClasses[selectedColor][selectedVariant];
    // const variantStyles = variantClasses[color][variant];

    const selectedSize = sizeClasses[size] ? size : "md";
    const sizeStyles = sizeClasses[selectedSize];    

    const selectedRound = roundedClasses[rounded] ? rounded : "md";
    const roundedStyles = roundedClasses[selectedRound];    
    

    return (
        <button
            disabled={isDisabled || isLoading}
            className={`${baseStyles} ${roundedStyles} ${variantStyles} ${sizeStyles} ${disabledStyles}`}
            {...rest}
            >            
            {isLoading ? <Spinner /> : children }            
        </button>
    );
};
