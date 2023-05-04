import { String } from 'aws-sdk/clients/apigateway'
import React from 'react'
import clsx from 'clsx'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
type variant = "primary"
type size = "small" | "medium" | "large" | "extraLarge"

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    className?: String
    variant?: variant
    size?: size
    loading?: boolean,
    disabled?: boolean
}
const variantClassNames = {
    "primary": "bg-blue-700 text-white rounded-md  shadow"
} as { [keyof: string]: string }
const sizeClassNames = {
    "small": "text-sm",
    "medium": "text-[16px]",
    "large": "text-lg",
    "extraLarge": "text-xl",
} as { [keyof: string]: string }

const Button = ({
    text,
    className,
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    ...props
}: IButton) => {
    return (
        <button disabled={loading ? true : disabled} className={clsx(
            'py-2 px-4 flex items-center justify-center',
            variantClassNames[variant],
            sizeClassNames[size],
            className
        )} {...props}
        >
            {
                loading ?
                    <AiOutlineLoading3Quarters className={clsx(
                        'animate-spin text-white',
                        sizeClassNames[size]
                    )} />
                    :
                    <>
                        {text}
                    </>
            }
        </button>
    )
}

export { Button }