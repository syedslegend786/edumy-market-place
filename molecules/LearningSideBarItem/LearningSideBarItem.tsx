import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
export interface LearningSideBarItemProps {
    id: string,
    name: string,
    selected: boolean
    index: number
    onClick?: () => void
}
export const LearningSideBarItem = ({
    id,
    name,
    selected,
    index,
    onClick = () => { }
}: LearningSideBarItemProps) => {

    return (
        <div onClick={onClick} className={clsx(
            'flex  items-center gap-x-2 p-3 cursor-pointer',
            {
                'bg-gray-200': selected
            }
        )}>
            <div className={clsx(
                'h-10 w-10 rounded-full flex-shrink-0   flex items-center justify-center',
                {
                    "bg-gray-200 text-black": !selected,
                    "bg-blue-700 text-white": selected
                }
            )}>
                <span>{index}</span>
            </div>
            <h1 className='font-semibold text-blue-700'>{name}</h1>
        </div>
    )
}