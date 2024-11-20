import { useState, useRef, useEffect } from "react"
import { Icon } from "./Icon"
import { Pressable } from "./Pressable"
import { useClickOutside } from "../hooks"

export const Select = ({label, required, placeholder, defaultValue, onSelect,  options = [], ...rest }) => {

    const selectRef = useRef(null)
    const [ value, setValue ] = useState(defaultValue || '')
    const [ isOpen, setOpen ] = useState(false)

    useClickOutside(selectRef, () => {
        if(isOpen){
            setOpen(false)
        }
    });

    useEffect(() => {
        if(value && onSelect){
            onSelect(value)
        }
    }, [value, onSelect])

    const getValueLabel = () => {
        return options?.find(x => x?.value === value)?.label || ''
    }
    
    return(
        <div className="flex flex-col">
            { label && (
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-white/50">{ label } {required && <span className="text-red-500">*</span>}</label>
            )}
            <div className="relative" ref={selectRef}>
                <button onClick={() => setOpen(!isOpen)} type="button" className="relative border w-full cursor-default bg-white px-4 py-2 h-10 text-[14px]  pr-10 text-left appearance-none leading-tight  transition-all duration-300 ease-in-out rounded-md focus:ring-1 focus:ring-offset-0 dark:bg-slate-700 text-slate-600 dark:text-slate-300  border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300">
                    <span className="flex items-center">
                        {
                            !value ?
                            <span className="block truncate text-slate-400">{placeholder}</span>
                            :
                            <span className="block truncate text-slate-600">{getValueLabel()}</span>
                        }
                        
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <Icon name="expand-up-down-line" />
                    </span>
                </button>
                {
                    options?.length > 0 &&
                    <div className={`${isOpen ? 'block' : 'hidden'} transition-all duration-300 ease-linear absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                        {
                            options?.map((opt, o) =>
                                <Pressable onClick={() => { setValue(opt.value); setOpen(false) }} className={`flex flex-row px-4 py-2 text-sm text-slate-600 ${opt?.value === value ? 'bg-primary-500 text-white hover:bg-primary-600' : 'hover:bg-primary-50 hover:text-primary-500'}`} key={o}>
                                    <div className="flex-1">{opt?.label}</div>
                                    {
                                        opt?.value === value &&
                                        <Icon name="check-fill" className="text-white" />
                                    }
                                </Pressable>
                            )
                        }
                    </div>
                }
                {
                    options?.length === 0 &&
                    <div className={`${isOpen ? 'block' : 'hidden'} transition-all duration-300 ease-linear absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                        <div className="px-3 py-2 text-sm text-slate-400">No Data Found</div>
                    </div>
                }
            </div>
            <input type="hidden" value={value || ''} onChange={() => {}} {...rest} />
        </div>
    )
}