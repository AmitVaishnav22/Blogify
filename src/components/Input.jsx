import React, { useId } from "react";

const Input=React.forwardRef(function Input({
    label,
    className="",
    type="text",
    ...props
},ref){
    const id=useId();
    return (
        <div className="w-full">
            {label}&& <label className='inline-block mb-1 pl-1' htmlFor={id}>
                {label}
            </label>
            <input
            type={type}
            className={`relative px-3 py-2 rounded-lg text-white bg-black border-2 border-transparent focus:bg-gradient-to-r focus:from-gray-500 focus:to-gray-500 duration-200 outline-none w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input;