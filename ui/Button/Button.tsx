import React from 'react'
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
}
const Button = ({ text, ...props }: IButton) => {
    return (
        <button className='border p-1' {...props}>{text}</button>
    )
}

export { Button }