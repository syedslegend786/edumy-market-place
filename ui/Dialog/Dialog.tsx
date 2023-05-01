import React from 'react'
import * as RadiDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
interface DialogProps {
    open: boolean,
    onChange: (open: boolean) => void,
    title?: string
    children: React.ReactElement
    className?: string
}
export const Dialog = ({ onChange, open, children, title, className }: DialogProps) => {
    return (
        <RadiDialog.Root open={open} onOpenChange={(open) => { onChange(open) }}>
            <RadiDialog.Portal>
                <RadiDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <RadiDialog.Content className={clsx(
                    "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none",
                    className
                )}>
                    {
                        title ?
                            <RadiDialog.Title className="text-mauve12 m-0 text-[17px] font-medium mb-5">
                                {title}
                            </RadiDialog.Title>
                            :
                            null
                    }
                    {children}
                    <div className="mt-[25px] flex justify-end">
                    </div>
                </RadiDialog.Content>
            </RadiDialog.Portal>
        </RadiDialog.Root>
    )
}