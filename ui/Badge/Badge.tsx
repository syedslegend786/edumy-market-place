import clsx from 'clsx'
import React from 'react'
interface BadgeProps {
    text: string
    className?: string
}
export const Badge = ({
    text, className
}: BadgeProps) => {
    return (
        <div className={clsx(
            "bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 w-max",
            className
        )}>{text}</div>
    )
}