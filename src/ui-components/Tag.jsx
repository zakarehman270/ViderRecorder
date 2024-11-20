import { Icon } from "./Icon"
import { Pressable } from "./Pressable"

export const Tag = ({children, clearable = false, onRemove}) => {
    
    return(
        <div className="px-2 py-1 mr-1 mb-2 text-sm space-x-2 bg-slate-200 text-slate-500 items-center inline-flex rounded-md" >
            <div>{children}</div>
            {
                clearable &&
                <Pressable onClick={onRemove}>
                    <Icon name="close-fill" className="text-red-500" />
                </Pressable>
            }
            
        </div>
    )
}