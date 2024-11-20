import { useState } from 'react'
import { Combobox as TWComboBox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Icon } from './Icon'

export const Combobox  = ({label, options,  required, ...rest }) => {

        
    const [query, setQuery] = useState('')
    const [ selected, setSelected ] = useState(null)

    const filtered =
    query === ''
      ? options
      : options.filter((opt) => {
          return opt?.label?.toLowerCase().includes(query.toLowerCase())
        })
    
    return(
        <div className="flex flex-col">
            { label && (
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-white/50">{ label } {required && <span className="text-red-500">*</span>}</label>
            )}
            <TWComboBox value={selected} onChange={(val) => setSelected(val)} onClose={() => setQuery('')}>
                <div className="relative">
                    <ComboboxInput
                        className={`w-full  px-2 py-2 h-9 text-sm  border appearance-none leading-tight  transition-all duration-300 ease-in-out rounded-md focus:ring-1 focus:ring-offset-0 dark:bg-slate-700 text-slate-600 dark:text-slate-300  border-gray-300 dark:border-slate-600 outline-0 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-300 dark:focus:ring-primary-300`}
                        displayValue={(person) => person?.label}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5" >
                        <Icon name="arrow-down-s-line" />
                    </ComboboxButton>
                </div>
                <ComboboxOptions
                    anchor="bottom"
                    transition
                    // className={`w-[var(--input-width)] rounded-xl border border-white/5 bg-slate-200 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0`}
                    className={`mt-1 min-h-24 max-h-56 w-[var(--input-width)] overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                >
                    {filtered.map((option) => (
                        <ComboboxOption
                        key={option?.value}
                        value={option}
                        className="group flex cursor-default items-center gap-2 text-slate-600  px-4 py-2 select-none hover:bg-primary-50 data-[selected]:bg-primary-500 data-[selected]:text-white"
                        >
                            <Icon name="check-fill" className="invisible size-4 group-data-[selected]:visible  group-data-[selected]:text-white" />
                            <div className="text-sm">{option?.label}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </TWComboBox>
            <input type="hidden" value={selected?.value || ''} {...rest} />
        </div>
    )
}
