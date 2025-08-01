import {Fragment} from "react"
import {Dialog, Transition} from '@headlessui/react'

function Drawer({isOpen, close,Children,props, title = "add_user", position = 'right'}) {
    const panelPositionClasses = position === 'right' ? 'right-0' : 'left-0';
    const panelTransformEnterFrom = position === 'right' ? 'translate-x-full' : '-translate-x-full';
    const panelTransformLeaveTo = position === 'right' ? 'translate-x-full' : '-translate-x-full';
    return (
            <Transition.Root show = {isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={close}>
                    <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className={`pointer-events-none fixed inset-y-0 flex max-w-full ${panelPositionClasses}`}>
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300 sm:duration-500"
                                enterFrom={panelTransformEnterFrom}
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300 sm:duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo={panelTransformLeaveTo}
                            >
                            <Dialog.Panel className="pointer-events-auto h-full w-screen max-w-md">
                                <Children {...props} className="h-full"/>    
                            </Dialog.Panel>
                            </Transition.Child>
                            </div>
                            </div>
                            </div>
                </Dialog>
            </Transition.Root>
    )
}

export default Drawer