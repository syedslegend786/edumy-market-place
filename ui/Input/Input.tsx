import React from 'react'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {

}
const Input = ({ ...props }: IInput) => {
    return (
        <input className={`border p-1 block`} {...props} />
    )
}

export { Input }