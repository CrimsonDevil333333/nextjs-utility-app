'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Asia/Kolkata'];

const TimezoneConverterPage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Timezone Converter</h1>
            <div className="space-y-3">
                {timezones.map(tz => {
                    const zonedTime = toZonedTime(currentTime, tz);
                    return (
                        <div key={tz} className="flex justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <span className="font-medium">{tz.replace('_', ' ')}</span>
                            <span className="font-mono text-lg">{format(zonedTime, 'yyyy-MM-dd HH:mm:ss')}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimezoneConverterPage;