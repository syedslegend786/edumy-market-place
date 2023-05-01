import { String } from 'aws-sdk/clients/apigateway'
import React from 'react'
import clsx from 'clsx'
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    className?: String
}
const Button = ({ text, className, ...props }: IButton) => {
    return (
        <button className={clsx(
            'border p-1',
            className
        )} {...props}
        >
            {text}
        </button>
    )
}

export { Button }