'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, X, PlusCircle } from 'lucide-react';

// --- Reusable Components ---

function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                setCopied(true);
                triggerHapticFeedback();
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    }, [valueToCopy]);

    return (
        <button
            onClick={handleCopy}
            className="p-2 rounded-md transition-all duration-200 ease-in-out bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
    );
}

const allTimezones = Intl.supportedValuesOf('timeZone');

const TimezoneConverterPage = () => {
    const [baseTime, setBaseTime] = useState(new Date());
    const [isLive, setIsLive] = useState(true);
    const [timezones, setTimezones] = useState(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Asia/Kolkata']);
    const [newTimezone, setNewTimezone] = useState(allTimezones[0] || 'UTC');

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isLive) {
            timer = setInterval(() => setBaseTime(new Date()), 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isLive]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        triggerHapticFeedback();
        setIsLive(false);
        setBaseTime(new Date(e.target.value));
    };

    const handleSetToNow = () => {
        triggerHapticFeedback();
        setIsLive(true);
        setBaseTime(new Date());
    };

    const handleAddTimezone = () => {
        triggerHapticFeedback();
        if (newTimezone && !timezones.includes(newTimezone)) {
            setTimezones([...timezones, newTimezone]);
        }
    };

    const handleRemoveTimezone = (tzToRemove: string) => {
        triggerHapticFeedback();
        setTimezones(timezones.filter(tz => tz !== tzToRemove));
    };

    return (
        <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Timezone Converter</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">View the current time in different timezones.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input
                            type="datetime-local"
                            value={format(baseTime, "yyyy-MM-dd'T'HH:mm")}
                            onChange={handleDateChange}
                            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button
                            onClick={handleSetToNow}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                            disabled={isLive}
                        >
                            Now
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        {timezones.map(tz => {
                            const zonedTime = toZonedTime(baseTime, tz);
                            const formattedTime = format(zonedTime, 'yyyy-MM-dd HH:mm:ss');
                            return (
                                <div key={tz} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-x-auto">
                                    <span className="font-medium">{tz.replace(/_/g, ' ')}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-lg">{formattedTime}</span>
                                        <CopyButton valueToCopy={formattedTime} ariaLabel={`Copy time for ${tz}`} />
                                        <button onClick={() => handleRemoveTimezone(tz)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Fix responsive layout for Add button and dropdown */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={newTimezone}
                            onChange={e => setNewTimezone(e.target.value)}
                            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        >
                            {allTimezones.map(tz => (
                                <option key={tz} value={tz}>
                                    {tz.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddTimezone}
                            className="w-full sm:w-auto flex items-center justify-center p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            <PlusCircle />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimezoneConverterPage;
