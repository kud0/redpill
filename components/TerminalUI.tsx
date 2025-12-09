import React from 'react';

interface TerminalUIProps {
    children: React.ReactNode;
    id?: string;
    title?: string; // Terminal title
    className?: string;
}

const TerminalUI: React.FC<TerminalUIProps> = ({
    children,
    id = "TERMINAL_CL",
    title = "ROOT_ACCESS",
    className = ""
}) => {
    return (
        <div className={`relative w-full overflow-hidden ${className}`}>
            {/* Glitchy Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-red via-transparent to-neon-red opacity-20 pointer-events-none"></div>

            <div className="relative border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:border-neon-red/40 transition-colors duration-500">

                {/* Terminal Header */}
                <div className="h-9 px-4 flex items-center justify-between border-b border-white/10 bg-white/5 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] opacity-70"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-70"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] opacity-70"></div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono tracking-widest pl-2 border-l border-white/10 ml-2">
                            User@RedPill:~/{id}
                        </span>
                    </div>
                    <div className="text-[10px] text-neon-red font-mono animate-pulse">
                        {title}
                    </div>
                </div>

                {/* Terminal Content */}
                <div className="p-6 md:p-8 font-mono relative min-h-[200px]">
                    {/* Scanline internal overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,6px_100%] opacity-20"></div>

                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                {/* Corner Decors */}
                <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-l border-t border-neon-red opacity-50"></div>
                <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-r border-t border-neon-red opacity-50"></div>
                <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-l border-b border-neon-red opacity-50"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-r border-b border-neon-red opacity-50"></div>
            </div>
        </div>
    );
};

export default TerminalUI;
