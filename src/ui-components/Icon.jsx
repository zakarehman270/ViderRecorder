export const Icon = ({name,  ...rest}) => {
    
    const baseStyle = `${rest?.className} icon ri-${name}`;
    return(
        <i className={baseStyle} />
    )
}