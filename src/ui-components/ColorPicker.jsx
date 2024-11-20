import { useState, useRef } from 'react'
import { HexColorPicker } from "react-colorful"
import { useClickOutside } from '../hooks'
import { Icon } from './Icon'

export const ColorPicker = ({ label, defaultValue, ...rest }) => {

    const popover = useRef(null)
    const [ show, setShow ] = useState(false)
    const [ value, setValue ] = useState(defaultValue || '#000000')
    

    useClickOutside(popover, () => setShow(false));


    return(        
        <div className="relative">
            {label && (
                  <label className="mb-1 text-sm font-medium text-gray-700 dark:text-white/50">{label}</label>
            )}
            <div className="relative flex">
                <div role="button" 
                    tabIndex={-1} 
                    onKeyDown={() => {}} 
                    className="px-3 w-full focus:border-primary-500 dark:border-slate-600 dark:focus:border-primary-300 dark:bg-slate-700 space-x-2 pr-4 flex flex-row h-10 items-center  text-base border border-gray-300 rounded-md" 
                    onClick={() => setShow(!show)}
                    >
                    <div className="w-4 h-4 rounded-full border border-gray-500/50" style={{backgroundColor: value}} />
                    <div className="text-md flex-1 text-slate-500 dark:text-slate-200">{value}</div>
                    <div className="text-gray-400">
                        <Icon name="palette-line" />
                    </div>
                </div>
                {
                    show &&                
                    <div className="absolute left-0 top-full shadow-lg z-40" ref={popover}>
                        <HexColorPicker color={value} onChange={(val) => setValue(val)} />
                    </div>                    
                    
                }                
            </div>
            <input type="hidden" value={ value } {...rest} />
        </div>                    
    )
}