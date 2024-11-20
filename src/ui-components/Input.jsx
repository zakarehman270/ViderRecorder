import { forwardRef } from "react"

export const Input = forwardRef( ( {
    label,
    size = "md",
    variant = "outline",
    isDisabled,
    prefix,
    suffix,
    helperText,
    required,
    error,
    isOtp = false,
    ...rest
}, ref ) => {
    const baseStyles = `block w-full ${isOtp && 'text-center focus:placeholder:opacity-0 ' }  appearance-none leading-tight  transition-all duration-300 ease-in-out rounded-md focus:ring-1 focus:ring-offset-0`;
    const sizeClasses = {
        sm: "px-2 py-2 h-9 text-sm",
        md: "px-4 py-2 h-10 text-[14px]",
        lg: "px-4 py-4 h-12 text-lg",
    };

    const variantClasses = {
        outline: `border bg-transparent dark:bg-slate-700 text-slate-600 dark:text-slate-300  border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300`,
        solid: `bg-gray-100 focus:bg-white focus:ring-primary-500`,
        subtle: `border-none bg-gray-50 focus:bg-white focus:ring-primary-500`,
    };

    const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
    const disabledStyles = isDisabled ? "bg-gray-100 cursor-not-allowed opacity-50" : "";

    const selectedSize = sizeClasses[ size ] || sizeClasses.md;
    const selectedVariant = variantClasses[ variant ] || variantClasses.outline;


    return (
        <div className="flex flex-col">
            { label && (
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-white/50">{ label } {required && <span className="text-red-500">*</span>}</label>
            ) }
            <div className="relative flex items-center">
                { prefix && ( <span className="absolute inset-y-0 left-0 flex items-center pl-3">{ prefix }</span>
                ) }
                <input
                    ref={ ref }
                    disabled={ isDisabled }
                    // required={required}
                    className={ `placeholder:text-gray-400 dark:placeholder:text-slate-500 ${ baseStyles } ${ selectedSize } ${ selectedVariant } ${ errorStyles } ${ disabledStyles } ${ prefix ? "pl-10" : ""
                        } ${ suffix ? "pr-10" : "" } autofill:webkit-text-fill` }
                    { ...rest }
                />
                { suffix && ( <span className="absolute inset-y-0 right-0 flex items-center pr-1">{ suffix }</span> ) }
            </div>
            { error ? ( <p className="mt-1 text-xs text-red-600">{ error }</p> )
                : ( helperText && <p className="mt-1 text-sm text-gray-500">{ helperText }</p>
                ) }
        </div>
    );
} )

Input.displayName = "Input"
