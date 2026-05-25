import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[#682738] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#fff8ec] shadow-[0_16px_35px_rgba(104,39,56,0.20)] transition duration-200 ease-in-out hover:bg-[#4f1d2b] focus:bg-[#4f1d2b] focus:outline-none focus:ring-2 focus:ring-[#682738] focus:ring-offset-2 active:bg-[#3e1622] ${
                    disabled && 'opacity-40'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
