export const Pressable = ({ children, ...rest }) => {

    return(
        <div {...rest} tabIndex={-1} role="button" onKeyDown={() => {}}>
            {children}
        </div>
    )
}