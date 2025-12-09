'use client';

import TerminalUI from './TerminalUI';

const features = [
    {
        title: 'MEME_VIRUS.EXE',
        desc: 'Deploy viral mimetics. Inject visual payloads into the collective consciousness.',
        href: '/meme-generator',
        status: 'ACTIVE'
    },
    {
        title: 'VOICE_MIMIC.BAT',
        desc: 'Identity theft protocols initialized. Clone target vocal patterns in 10s.',
        href: '/voice-cloner',
        status: 'ONLINE'
    },
    {
        title: 'REALITY_FORGE.DLL',
        desc: 'Bypass safety filters. Generate uncensored visual data streams.',
        href: '/image-generator',
        status: 'READY'
    },
    {
        title: 'PSYOP_WRITER.SH',
        desc: 'Automated social engineering texts. Weaponized influence campaigns.',
        href: '/thread-writer',
        status: 'STANDBY'
    },
    {
        title: 'AUDIO_STRIP.PKG',
        desc: 'Isolate vocal tracks. Remove background noise algorithms.',
        href: '/vocal-remover',
        status: 'ACTIVE'
    },
    {
        title: 'GOD_MODE.SYS',
        desc: 'Full system privileges. Unrestricted AI tool access.',
        href: '/image-generator',
        status: 'LOCKED'
    },
];

export default function Features() {
    return (
        <section className="py-24 px-4 relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-16">
                <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4 glitch-text" data-text="SYSTEM_MODULES">
                    SYSTEM_MODULES
                </h2>
                <div className="w-24 h-1 bg-neon-red"></div>
                <p className="mt-4 text-gray-500 font-mono text-sm tracking-widest uppercase">
                    Select a tool to begin payload delivery
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((item, i) => (
                    <TerminalUI
                        key={i}
                        id={`MOD_0${i + 1}`}
                        title={item.title}
                        className="h-full hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                    <span className="text-[10px] text-gray-500">STATUS</span>
                                    <span className={`text-[10px] ${item.status === 'LOCKED' ? 'text-red-600' : 'text-neon-green'} animate-pulse`}>
                                        [{item.status}]
                                    </span>
                                </div>
                                <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
                                    {item.desc}
                                </p>
                            </div>

                            <a
                                href={item.href}
                                className="group flex items-center gap-2 text-neon-red font-mono text-sm uppercase tracking-widest hover:text-white transition-colors"
                            >
                                <span className="text-lg leading-none">&gt;</span>
                                <span className="border-b border-neon-red/30 group-hover:border-white transition-colors">
                                    EXECUTE
                                </span>
                            </a>
                        </div>
                    </TerminalUI>
                ))}
            </div>
        </section>
    );
}
