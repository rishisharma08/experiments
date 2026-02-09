import type { ButtonHTMLAttributes } from "react";

function Button( props: ButtonHTMLAttributes<HTMLButtonElement> ){
  const {className = "", ...others} = props;
  return <button
    type="button"
    className={`bg-gray-900 hover:bg-gray-700 transition-colors duration-300 rounded px-3 py-2 font-mono text-sm font-normal text-white mt-2 uppercase cursor-pointer tracking-normal ${className}`}
    {...others}
  />;
}

export default Button;