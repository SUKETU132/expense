import React from 'react';

const Button = () => {
  return (
    <button 
      title="Add New"
      className="group flex items-center justify-center p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 shadow-md transition-all duration-300 outline-none focus:ring focus:ring-zinc-500"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="50px" 
        height="50px" 
        viewBox="0 0 24 24" 
        className="stroke-zinc-300 fill-none group-hover:fill-zinc-500 group-active:stroke-zinc-100 group-active:fill-zinc-400 transition-all duration-300"
      >
        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5" />
        <path d="M8 12H16" strokeWidth="1.5" />
        <path d="M12 16V8" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

export default Button;
