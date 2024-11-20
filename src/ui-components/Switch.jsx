import { Switch as TwSwitch, Field, Label  } from '@headlessui/react'

export const Switch = ({label, ...rest}) => {

    return(
        <Field className="relative space-x-2 flex flex-row items-center">                        
            <TwSwitch                                        
                className="group inline-flex h-5 w-8 items-center rounded-full bg-zinc-200 dark:bg-zinc-600 transition dark:data-[checked]:bg-primary-300 data-[checked]:bg-primary-500"
                {...rest}
                >
                <span className="size-4 translate-x-0.5 rounded-full bg-white transition group-data-[checked]:translate-x-3.5" />
            </TwSwitch>
            <Label className="select-none text-zinc-500 text-sm dark:text-white/50">{label}</Label>
        </Field>
    )
}
