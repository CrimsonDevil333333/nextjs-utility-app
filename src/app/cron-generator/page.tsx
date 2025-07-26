'use client';

import { useState, useCallback, useMemo } from 'react';
import cronParser from 'cron-parser';
import { format } from 'date-fns'; // Used for formatting preview dates

// Reusable CopyButton component (included for completeness as per previous context)
function CopyButton({ valueToCopy, ariaLabel }: { valueToCopy: string; ariaLabel: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    }, [valueToCopy]);

    const isValueEmpty = !valueToCopy;

    return (
        <button
            onClick={handleCopy}
            disabled={isValueEmpty}
            className={`
                px-4 py-2 text-sm font-medium rounded-md
                flex items-center space-x-2
                transition-all duration-200 ease-in-out
                ${isValueEmpty
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                }
            `}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy</span>
                </>
            )}
        </button>
    );
}


export default function CronGeneratorPage() {
    type PresetType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

    const [preset, setPreset] = useState<PresetType>('daily');

    // States for custom/detailed settings
    const [customMinute, setCustomMinute] = useState('0');
    const [customHour, setCustomHour] = useState('0');
    const [customDayOfMonth, setCustomDayOfMonth] = useState('*');
    const [customMonth, setCustomMonth] = useState('*');
    const [customDayOfWeek, setCustomDayOfWeek] = useState('*');

    // Specific preset options
    const [minutelyInterval, setMinutelyInterval] = useState('1'); // for minutely '*/X'
    const [hourlyAtMinute, setHourlyAtMinute] = useState('0'); // for hourly 'M *'
    const [dailyAtHour, setDailyAtHour] = useState('0'); // for daily 'M H'
    const [dailyAtMinute, setDailyAtMinute] = useState('0');
    const [weeklyAtDay, setWeeklyAtDay] = useState('0'); // for weekly 'M H * * DOW'
    const [weeklyAtHour, setWeeklyAtHour] = useState('0');
    const [weeklyAtMinute, setWeeklyAtMinute] = useState('0');
    const [monthlyAtDay, setMonthlyAtDay] = useState('1'); // for monthly 'M H DOM * *'
    const [monthlyAtHour, setMonthlyAtHour] = useState('0');
    const [monthlyAtMinute, setMonthlyAtMinute] = useState('0');
    const [yearlyAtMonth, setYearlyAtMonth] = useState('1'); // for yearly 'M H DOM Mth *'
    const [yearlyAtDay, setYearlyAtDay] = useState('1');
    const [yearlyAtHour, setYearlyAtHour] = useState('0');
    const [yearlyAtMinute, setYearlyAtMinute] = useState('0');

    // Helper to pad single digits with a leading zero
    const padZero = (num: string | number) => String(num).padStart(2, '0');

    const generatedCronExpression = useMemo(() => {
        let minute = '';
        let hour = '';
        let dayOfMonth = '';
        let month = '';
        let dayOfWeek = '';

        switch (preset) {
            case 'minutely':
                minute = `*/${minutelyInterval}`;
                hour = '*';
                dayOfMonth = '*';
                month = '*';
                dayOfWeek = '*';
                break;
            case 'hourly':
                minute = padZero(hourlyAtMinute);
                hour = '*';
                dayOfMonth = '*';
                month = '*';
                dayOfWeek = '*';
                break;
            case 'daily':
                minute = padZero(dailyAtMinute);
                hour = padZero(dailyAtHour);
                dayOfMonth = '*';
                month = '*';
                dayOfWeek = '*';
                break;
            case 'weekly':
                minute = padZero(weeklyAtMinute);
                hour = padZero(weeklyAtHour);
                dayOfMonth = '*';
                month = '*';
                dayOfWeek = weeklyAtDay;
                break;
            case 'monthly':
                minute = padZero(monthlyAtMinute);
                hour = padZero(monthlyAtHour);
                dayOfMonth = monthlyAtDay;
                month = '*';
                dayOfWeek = '*';
                break;
            case 'yearly':
                minute = padZero(yearlyAtMinute);
                hour = padZero(yearlyAtHour);
                dayOfMonth = yearlyAtDay;
                month = yearlyAtMonth;
                dayOfWeek = '*';
                break;
            case 'custom':
            default:
                minute = customMinute;
                hour = customHour;
                dayOfMonth = customDayOfMonth;
                month = customMonth;
                dayOfWeek = customDayOfWeek;
                break;
        }
        return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    }, [
        preset,
        minutelyInterval, hourlyAtMinute,
        dailyAtHour, dailyAtMinute,
        weeklyAtDay, weeklyAtHour, weeklyAtMinute,
        monthlyAtDay, monthlyAtHour, monthlyAtMinute,
        yearlyAtMonth, yearlyAtDay, yearlyAtHour, yearlyAtMinute,
        customMinute, customHour, customDayOfMonth, customMonth, customDayOfWeek
    ]);

    const nextRunDates = useMemo(() => {
        const dates: Date[] = [];
        let isValidCron = true;
        try {
            const options = { currentDate: new Date() }; // Start parsing from current date
            const interval = cronParser.parse(generatedCronExpression, options);
            for (let i = 0; i < 5; i++) {
                dates.push(interval.next().toDate());
            }
        } catch (e: any) {
            isValidCron = false;
            // console.error("Invalid cron expression:", e.message);
        }
        return isValidCron ? dates : [];
    }, [generatedCronExpression]);

    const handleReset = useCallback(() => {
        setPreset('daily');
        setCustomMinute('0');
        setCustomHour('0');
        setCustomDayOfMonth('*');
        setCustomMonth('*');
        setCustomDayOfWeek('*');
        setMinutelyInterval('1');
        setHourlyAtMinute('0');
        setDailyAtHour('0');
        setDailyAtMinute('0');
        setWeeklyAtDay('0');
        setWeeklyAtHour('0');
        setWeeklyAtMinute('0');
        setMonthlyAtDay('1');
        setMonthlyAtHour('0');
        setMonthlyAtMinute('0');
        setYearlyAtMonth('1');
        setYearlyAtDay('1');
        setYearlyAtHour('0');
        setYearlyAtMinute('0');
    }, []);


    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Cron Job Generator</h1>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                    <label htmlFor="cron-preset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Preset Schedule:
                    </label>
                    <select
                        id="cron-preset"
                        value={preset}
                        onChange={(e) => setPreset(e.target.value as PresetType)}
                        className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="minutely">Every Minute / Every X Minutes</option>
                        <option value="hourly">Every Hour (at a specific minute)</option>
                        <option value="daily">Every Day (at a specific time)</option>
                        <option value="weekly">Every Week (on a specific day and time)</option>
                        <option value="monthly">Every Month (on a specific day of month and time)</option>
                        <option value="yearly">Every Year (on a specific month, day, and time)</option>
                        <option value="custom">Custom (define all fields)</option>
                    </select>
                </div>

                {/* Preset Configuration Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {preset === 'minutely' && (
                        <div>
                            <label htmlFor="minutely-interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Every X Minutes:
                            </label>
                            <input
                                type="number"
                                id="minutely-interval"
                                value={minutelyInterval}
                                onChange={(e) => setMinutelyInterval(e.target.value)}
                                min="1"
                                max="59"
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {preset === 'hourly' && (
                        <div>
                            <label htmlFor="hourly-at-minute" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                At Minute:
                            </label>
                            <input
                                type="number"
                                id="hourly-at-minute"
                                value={hourlyAtMinute}
                                onChange={(e) => setHourlyAtMinute(e.target.value)}
                                min="0"
                                max="59"
                                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {(preset === 'daily' || preset === 'weekly' || preset === 'monthly' || preset === 'yearly') && (
                        <>
                            {preset === 'weekly' && (
                                <div>
                                    <label htmlFor="weekly-at-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        On Day:
                                    </label>
                                    <select
                                        id="weekly-at-day"
                                        value={weeklyAtDay}
                                        onChange={(e) => setWeeklyAtDay(e.target.value)}
                                        className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                                            <option key={day} value={index}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {preset === 'monthly' && (
                                <div>
                                    <label htmlFor="monthly-at-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        On Day of Month:
                                    </label>
                                    <input
                                        type="number"
                                        id="monthly-at-day"
                                        value={monthlyAtDay}
                                        onChange={(e) => setMonthlyAtDay(e.target.value)}
                                        min="1"
                                        max="31"
                                        className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {preset === 'yearly' && (
                                <>
                                    <div>
                                        <label htmlFor="yearly-at-month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            On Month:
                                        </label>
                                        <select
                                            id="yearly-at-month"
                                            value={yearlyAtMonth}
                                            onChange={(e) => setYearlyAtMonth(e.target.value)}
                                            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <option key={m} value={m}>
                                                    {new Date(0, m - 1).toLocaleString('en-US', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="yearly-at-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            On Day of Month:
                                        </label>
                                        <input
                                            type="number"
                                            id="yearly-at-day"
                                            value={yearlyAtDay}
                                            onChange={(e) => setYearlyAtDay(e.target.value)}
                                            min="1"
                                            max="31"
                                            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label htmlFor="time-hour" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    At Hour (24h):
                                </label>
                                <input
                                    type="number"
                                    id="time-hour"
                                    value={
                                        preset === 'daily' ? dailyAtHour :
                                        preset === 'weekly' ? weeklyAtHour :
                                        preset === 'monthly' ? monthlyAtHour :
                                        yearlyAtHour
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (preset === 'daily') setDailyAtHour(value);
                                        else if (preset === 'weekly') setWeeklyAtHour(value);
                                        else if (preset === 'monthly') setMonthlyAtHour(value);
                                        else setYearlyAtHour(value);
                                    }}
                                    min="0"
                                    max="23"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="time-minute" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    At Minute:
                                </label>
                                <input
                                    type="number"
                                    id="time-minute"
                                    value={
                                        preset === 'daily' ? dailyAtMinute :
                                        preset === 'weekly' ? weeklyAtMinute :
                                        preset === 'monthly' ? monthlyAtMinute :
                                        yearlyAtMinute
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (preset === 'daily') setDailyAtMinute(value);
                                        else if (preset === 'weekly') setWeeklyAtMinute(value);
                                        else if (preset === 'monthly') setMonthlyAtMinute(value);
                                        else setYearlyAtMinute(value);
                                    }}
                                    min="0"
                                    max="59"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Custom fields */}
                    {preset === 'custom' && (
                        <>
                            <div>
                                <label htmlFor="custom-minute" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Minute (0-59, *, /, -):
                                </label>
                                <input
                                    type="text"
                                    id="custom-minute"
                                    value={customMinute}
                                    onChange={(e) => setCustomMinute(e.target.value)}
                                    placeholder="e.g., 0, */5, 10-20"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="custom-hour" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Hour (0-23, *, /, -):
                                </label>
                                <input
                                    type="text"
                                    id="custom-hour"
                                    value={customHour}
                                    onChange={(e) => setCustomHour(e.target.value)}
                                    placeholder="e.g., 0, 12, 9-17"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="custom-day-of-month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Day of Month (1-31, *, L, ?):
                                </label>
                                <input
                                    type="text"
                                    id="custom-day-of-month"
                                    value={customDayOfMonth}
                                    onChange={(e) => setCustomDayOfMonth(e.target.value)}
                                    placeholder="e.g., *, 15, L"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="custom-month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Month (1-12 or JAN-DEC, *):
                                </label>
                                <input
                                    type="text"
                                    id="custom-month"
                                    value={customMonth}
                                    onChange={(e) => setCustomMonth(e.target.value)}
                                    placeholder="e.g., *, 6, JUL"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="custom-day-of-week" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Day of Week (0-7 or SUN-SAT, *, L, #):
                                </label>
                                <input
                                    type="text"
                                    id="custom-day-of-week"
                                    value={customDayOfWeek}
                                    onChange={(e) => setCustomDayOfWeek(e.target.value)}
                                    placeholder="e.g., *, 0, MON, 1-5"
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                        aria-label="Reset all fields"
                        title="Reset All Fields"
                    >
                        Reset Fields
                    </button>
                </div>

                {/* Generated Cron Expression */}
                <div className="mb-6">
                    <label htmlFor="generated-cron" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Generated Cron Expression:
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            id="generated-cron"
                            readOnly
                            value={generatedCronExpression}
                            className="flex-grow p-2.5 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all"
                        />
                        <CopyButton valueToCopy={generatedCronExpression} ariaLabel="Copy generated cron expression" />
                    </div>
                </div>

                {/* Next Run Times Preview */}
                <div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Next 5 Run Times:</h3>
                    {nextRunDates.length > 0 ? (
                        <ul className="list-disc list-inside bg-gray-100 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            {nextRunDates.map((date, index) => (
                                <li key={index} className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                                    {format(date, 'yyyy-MM-dd HH:mm:ss (EEEE)')}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-red-600 dark:text-red-400 text-sm">
                            Invalid cron expression or no future runs found based on the current configuration.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}