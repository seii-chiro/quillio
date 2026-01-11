import React from 'react'

type FormSubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
}

const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
    ({ children, className = '', type = 'submit', ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                className={`${className} mt-2 w-full bg-black hover:inset-0.5 text-white py-2 rounded-md font-medium transition-colors duration-150`.trim()}
                {...props}
            >
                {children}
            </button>
        )
    }
)

FormSubmitButton.displayName = 'FormSubmitButton'

export default FormSubmitButton