'use client';

import { useState, useCallback, useMemo } from 'react';
import cronParser from 'cron-parser';
import { format } from 'date-fns';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Copy, Check, RotateCcw } from 'lucide-react';

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

    const isValueEmpty = !valueToCopy;

    return (
        <button
            onClick={handleCopy}
            disabled={isValueEmpty}
            className={`p-2 rounded-md transition-all duration-200 ease-in-out ${isValueEmpty ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    );
}

const PRESET_OPTIONS = [
    { id: 'minutely', label: 'Minutely' }, { id: 'hourly', label: 'Hourly' }, { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly' },
    { id: 'custom', label: 'Custom' },
] as const;

type PresetType = typeof PRESET_OPTIONS[number]['id'];

function PresetTabs({ currentPreset, onSelectPreset }: { currentPreset: PresetType; onSelectPreset: (preset: PresetType) => void }) {
    return (
        <div className="p-1.5 bg-gray-200 dark:bg-gray-900 rounded-xl flex flex-wrap justify-center gap-1 shadow-inner mb-8">
            {PRESET_OPTIONS.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => { onSelectPreset(id); triggerHapticFeedback(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${currentPreset === id ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

type PillOption = { value: string; label: string; };

function PillSelector({ options, selectedValue, onSelect, className = '' }: { options: readonly PillOption[]; selectedValue: string; onSelect: (value: string) => void; className?: string; }) {
    return (
        <div className={`flex flex-wrap gap-1.5 ${className}`}>
            {options.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => { onSelect(value); triggerHapticFeedback(); }}
                    className={`h-9 px-3 rounded-full text-xs font-medium transition-all duration-200 flex-grow sm:flex-grow-0 ${selectedValue === value ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

// --- Constants for Pill Selectors ---

const DAY_OPTIONS: readonly PillOption[] = [
    { value: '0', label: 'Sun' }, { value: '1', label: 'Mon' }, { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' }, { value: '4', label: 'Thu' }, { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
];

const MONTH_OPTIONS: readonly PillOption[] = [
    { value: '1', label: 'Jan' }, { value: '2', label: 'Feb' }, { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' }, { value: '5', label: 'May' }, { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' }, { value: '8', label: 'Aug' }, { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
];


// --- Main Page Component ---

export default function CronGeneratorPage() {
    const [preset, setPreset] = useState<PresetType>('daily');
    const [customMinute, setCustomMinute] = useState('*');
    const [customHour, setCustomHour] = useState('*');
    const [customDayOfMonth, setCustomDayOfMonth] = useState('*');
    const [customMonth, setCustomMonth] = useState('*');
    const [customDayOfWeek, setCustomDayOfWeek] = useState('*');
    const [minutelyInterval, setMinutelyInterval] = useState('5');
    const [hourlyAtMinute, setHourlyAtMinute] = useState('0');
    const [dailyAtHour, setDailyAtHour] = useState('0');
    const [dailyAtMinute, setDailyAtMinute] = useState('0');
    const [weeklyAtDay, setWeeklyAtDay] = useState('1'); // Monday
    const [weeklyAtHour, setWeeklyAtHour] = useState('0');
    const [weeklyAtMinute, setWeeklyAtMinute] = useState('0');
    const [monthlyAtDay, setMonthlyAtDay] = useState('1');
    const [monthlyAtHour, setMonthlyAtHour] = useState('0');
    const [monthlyAtMinute, setMonthlyAtMinute] = useState('0');
    const [yearlyAtMonth, setYearlyAtMonth] = useState('1');
    const [yearlyAtDay, setYearlyAtDay] = useState('1');
    const [yearlyAtHour, setYearlyAtHour] = useState('0');
    const [yearlyAtMinute, setYearlyAtMinute] = useState('0');

    const padZero = (num: string | number) => String(num).padStart(2, '0');

    const generatedCronExpression = useMemo(() => {
        let minute = '', hour = '', dayOfMonth = '', month = '', dayOfWeek = '';
        switch (preset) {
            case 'minutely': minute = `*/${minutelyInterval}`; hour = '*'; dayOfMonth = '*'; month = '*'; dayOfWeek = '*'; break;
            case 'hourly': minute = padZero(hourlyAtMinute); hour = '*'; dayOfMonth = '*'; month = '*'; dayOfWeek = '*'; break;
            case 'daily': minute = padZero(dailyAtMinute); hour = padZero(dailyAtHour); dayOfMonth = '*'; month = '*'; dayOfWeek = '*'; break;
            case 'weekly': minute = padZero(weeklyAtMinute); hour = padZero(weeklyAtHour); dayOfMonth = '*'; month = '*'; dayOfWeek = weeklyAtDay; break;
            case 'monthly': minute = padZero(monthlyAtMinute); hour = padZero(monthlyAtHour); dayOfMonth = monthlyAtDay; month = '*'; dayOfWeek = '*'; break;
            case 'yearly': minute = padZero(yearlyAtMinute); hour = padZero(yearlyAtHour); dayOfMonth = yearlyAtDay; month = yearlyAtMonth; dayOfWeek = '*'; break;
            case 'custom': default: minute = customMinute; hour = customHour; dayOfMonth = customDayOfMonth; month = customMonth; dayOfWeek = customDayOfWeek; break;
        }
        return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    }, [preset, minutelyInterval, hourlyAtMinute, dailyAtHour, dailyAtMinute, weeklyAtDay, weeklyAtHour, weeklyAtMinute, monthlyAtDay, monthlyAtHour, monthlyAtMinute, yearlyAtMonth, yearlyAtDay, yearlyAtHour, yearlyAtMinute, customMinute, customHour, customDayOfMonth, customMonth, customDayOfWeek]);

    const nextRunDates = useMemo(() => {
        try {
            const interval = cronParser.parse(generatedCronExpression, { currentDate: new Date() });
            return Array.from({ length: 5 }, () => interval.next().toDate());
        } catch (e) { return []; }
    }, [generatedCronExpression]);

    const handleReset = useCallback(() => {
        triggerHapticFeedback();
        setPreset('daily'); setCustomMinute('*'); setCustomHour('*'); setCustomDayOfMonth('*'); setCustomMonth('*'); setCustomDayOfWeek('*'); setMinutelyInterval('5'); setHourlyAtMinute('0'); setDailyAtHour('0'); setDailyAtMinute('0'); setWeeklyAtDay('1'); setWeeklyAtHour('0'); setWeeklyAtMinute('0'); setMonthlyAtDay('1'); setMonthlyAtHour('0'); setMonthlyAtMinute('0'); setYearlyAtMonth('1'); setYearlyAtDay('1'); setYearlyAtHour('0'); setYearlyAtMinute('0');
    }, []);

    const commonInputClass = "w-full p-2.5 h-10 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    const fieldContainerClass = "flex flex-col gap-y-6";

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Cron Job Generator</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Easily create cron expressions with common presets or custom rules.</p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <PresetTabs currentPreset={preset} onSelectPreset={setPreset} />

                    <div className={fieldContainerClass}>
                        {preset === 'minutely' && (
                            <div><label htmlFor="minutely-interval" className={commonLabelClass}>Every X Minutes:</label><input type="number" id="minutely-interval" value={minutelyInterval} onFocus={triggerHapticFeedback} onChange={(e) => { setMinutelyInterval(e.target.value); triggerHapticFeedback(); }} min="1" max="59" className={commonInputClass} /></div>
                        )}
                        {preset === 'hourly' && (
                            <div><label htmlFor="hourly-at-minute" className={commonLabelClass}>At Minute:</label><input type="number" id="hourly-at-minute" value={hourlyAtMinute} onFocus={triggerHapticFeedback} onChange={(e) => { setHourlyAtMinute(e.target.value); triggerHapticFeedback(); }} min="0" max="59" className={commonInputClass} /></div>
                        )}
                        {preset === 'daily' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="sm:col-span-2 text-base font-medium text-gray-800 dark:text-gray-200">Run at:</label><div><label htmlFor="time-hour" className={commonLabelClass}>Hour (24h):</label><input type="number" id="time-hour" value={dailyAtHour} onFocus={triggerHapticFeedback} onChange={(e) => setDailyAtHour(e.target.value)} min="0" max="23" className={commonInputClass} /></div><div><label htmlFor="time-minute" className={commonLabelClass}>Minute:</label><input type="number" id="time-minute" value={dailyAtMinute} onFocus={triggerHapticFeedback} onChange={(e) => setDailyAtMinute(e.target.value)} min="0" max="59" className={commonInputClass} /></div></div>
                        )}
                        {preset === 'weekly' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="sm:col-span-2 text-base font-medium text-gray-800 dark:text-gray-200">Run on:</label><div className="sm:col-span-2"><label className={commonLabelClass}>Day of the Week:</label><PillSelector options={DAY_OPTIONS} selectedValue={weeklyAtDay} onSelect={setWeeklyAtDay} /></div><div><label htmlFor="time-hour" className={commonLabelClass}>Hour (24h):</label><input type="number" id="time-hour" value={weeklyAtHour} onFocus={triggerHapticFeedback} onChange={(e) => setWeeklyAtHour(e.target.value)} min="0" max="23" className={commonInputClass} /></div><div><label htmlFor="time-minute" className={commonLabelClass}>Minute:</label><input type="number" id="time-minute" value={weeklyAtMinute} onFocus={triggerHapticFeedback} onChange={(e) => setWeeklyAtMinute(e.target.value)} min="0" max="59" className={commonInputClass} /></div></div>
                        )}
                        {preset === 'monthly' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><label className="sm:col-span-3 text-base font-medium text-gray-800 dark:text-gray-200">Run on:</label><div><label htmlFor="monthly-at-day" className={commonLabelClass}>Day of Month:</label><input type="number" id="monthly-at-day" value={monthlyAtDay} onFocus={triggerHapticFeedback} onChange={(e) => { setMonthlyAtDay(e.target.value); triggerHapticFeedback(); }} min="1" max="31" className={commonInputClass} /></div><div><label htmlFor="time-hour" className={commonLabelClass}>Hour (24h):</label><input type="number" id="time-hour" value={monthlyAtHour} onFocus={triggerHapticFeedback} onChange={(e) => setMonthlyAtHour(e.target.value)} min="0" max="23" className={commonInputClass} /></div><div><label htmlFor="time-minute" className={commonLabelClass}>Minute:</label><input type="number" id="time-minute" value={monthlyAtMinute} onFocus={triggerHapticFeedback} onChange={(e) => setMonthlyAtMinute(e.target.value)} min="0" max="59" className={commonInputClass} /></div></div>
                        )}
                        {preset === 'yearly' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="sm:col-span-2 text-base font-medium text-gray-800 dark:text-gray-200">Run on:</label><div className="sm:col-span-2"><label className={commonLabelClass}>Month:</label><PillSelector options={MONTH_OPTIONS} selectedValue={yearlyAtMonth} onSelect={setYearlyAtMonth} /></div><div><label htmlFor="yearly-at-day" className={commonLabelClass}>Day of Month:</label><input type="number" id="yearly-at-day" value={yearlyAtDay} onFocus={triggerHapticFeedback} onChange={(e) => { setYearlyAtDay(e.target.value); triggerHapticFeedback(); }} min="1" max="31" className={commonInputClass} /></div><div><label htmlFor="time-hour" className={commonLabelClass}>Hour (24h):</label><input type="number" id="time-hour" value={yearlyAtHour} onFocus={triggerHapticFeedback} onChange={(e) => setYearlyAtHour(e.target.value)} min="0" max="23" className={commonInputClass} /></div><div className="sm:col-span-2"><label htmlFor="time-minute" className={commonLabelClass}>Minute:</label><input type="number" id="time-minute" value={yearlyAtMinute} onFocus={triggerHapticFeedback} onChange={(e) => setYearlyAtMinute(e.target.value)} min="0" max="59" className={commonInputClass} /></div></div>
                        )}
                        {preset === 'custom' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><div><label htmlFor="custom-minute" className={commonLabelClass}>Minute (0-59):</label><input type="text" id="custom-minute" value={customMinute} onFocus={triggerHapticFeedback} onChange={(e) => { setCustomMinute(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., */15" className={commonInputClass} /></div><div><label htmlFor="custom-hour" className={commonLabelClass}>Hour (0-23):</label><input type="text" id="custom-hour" value={customHour} onFocus={triggerHapticFeedback} onChange={(e) => { setCustomHour(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., 9-17" className={commonInputClass} /></div><div><label htmlFor="custom-day-of-month" className={commonLabelClass}>Day of Month:</label><input type="text" id="custom-day-of-month" value={customDayOfMonth} onFocus={triggerHapticFeedback} onChange={(e) => { setCustomDayOfMonth(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., 1,15" className={commonInputClass} /></div><div><label htmlFor="custom-month" className={commonLabelClass}>Month (1-12):</label><input type="text" id="custom-month" value={customMonth} onFocus={triggerHapticFeedback} onChange={(e) => { setCustomMonth(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., *" className={commonInputClass} /></div><div><label htmlFor="custom-day-of-week" className={commonLabelClass}>Day of Week (0-6):</label><input type="text" id="custom-day-of-week" value={customDayOfWeek} onFocus={triggerHapticFeedback} onChange={(e) => { setCustomDayOfWeek(e.target.value); triggerHapticFeedback(); }} placeholder="e.g., 1-5" className={commonInputClass} /></div></div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 space-y-6">
                        <div>
                            <label htmlFor="generated-cron" className={commonLabelClass}>Generated Cron Expression:</label>
                            <div className="flex items-center gap-2"><input type="text" id="generated-cron" readOnly value={generatedCronExpression} className="flex-grow p-3 font-mono text-base border rounded-lg bg-gray-100 dark:bg-gray-900/80 dark:border-gray-700 text-gray-800 dark:text-gray-200 cursor-default select-all" /><CopyButton valueToCopy={generatedCronExpression} ariaLabel="Copy generated cron expression" /></div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Next 5 Scheduled Runs:</h3>
                            {nextRunDates.length > 0 ? (<div className="bg-gray-100 dark:bg-gray-900/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700"><ul className="space-y-2">{nextRunDates.map((date, index) => (<li key={index} className="text-gray-800 dark:text-gray-200 font-mono text-sm">{format(date, 'yyyy-MM-dd HH:mm:ss (EEEE)')}</li>))}</ul></div>) : (<div className="text-red-600 dark:text-red-400 text-sm p-4 bg-red-50 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-700">Invalid cron expression. Please check your custom values or preset configuration.</div>)}
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors" aria-label="Reset all fields" title="Reset All Fields">
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
