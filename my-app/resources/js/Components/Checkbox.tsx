import { InputHTMLAttributes } from 'react';

export default function Checkbox({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[#201713]/20 bg-[#fffaf1] text-[#682738] shadow-sm focus:ring-[#682738] ' +
                className
            }
        />
    );
}
