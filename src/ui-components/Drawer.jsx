import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { Icon } from './Icon'

export const Drawer = ({ isOpen, onClose, children, footer, size="md", title }) => {

    const sizeClasses = {
        xs: 'max-w-md',
        sm: 'max-w-lg',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
        xl: 'max-w-3xl'
    }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 dark:bg-gray-900/80 bg-opacity-75 transition-opacity duration-300 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <DialogPanel
                        transition
                        className={`pointer-events-auto relative w-screen ${sizeClasses[size]} transform transition duration-300 ease-in-out data-[closed]:translate-x-full sm:duration-50`}
                        >
                        <TransitionChild>
                            <div className="absolute left-0 top-0 -mt-2 -ml-8 flex pr-2 pt-4 duration-300 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                                <button
                                    type="button"
                                    onClick={() => onClose()}
                                    className="relative w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full text-white/80 hover:text-white focus:outline-none focus:ring-0 focus:ring-white"
                                    >
                                    <span className="absolute -inset-2.5" />
                                    <span className="sr-only">Close panel</span>
                                    <Icon name="close-line" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div className="flex h-full flex-col  bg-white dark:bg-slate-800  shadow-xl">   
                            {
                                title &&
                                <div className="px-10 py-4">
                                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-300">{title}</DialogTitle>
                                </div>
                            }                                                     
                            <div className="relative flex-1">
                                <div className="absolute inset-0 overflow-y-auto">
                                    <div className="p-5">
                                        {children}
                                    </div>
                                </div>
                            </div>
                            {
                                (footer) &&
                                <div className="">
                                    {footer}
                                </div>
                            }
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </div>
    </Dialog>
    )
}
