'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Label } from 'recharts';
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Download } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';
import html2canvas from 'html2canvas';

// --- Types and Constants ---
type ChartType = 'bar' | 'line' | 'pie';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff595e'];

const ChartMakerPage = () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [rawData, setRawData] = useState('Category,Value\nApples,12\nOranges,19\nBananas,3\nGrapes,5\nPears,2');
  const [hasHeader, setHasHeader] = useState(true);

  // New feature states
  const [chartTitle, setChartTitle] = useState('My Awesome Chart');
  const [xAxisLabel, setXAxisLabel] = useState('Category');
  const [yAxisLabel, setYAxisLabel] = useState('Value');
  const [chartColor, setChartColor] = useState('#8884d8');

  const chartRef = useRef<HTMLDivElement>(null);

  const parsedData = useMemo(() => {
    const lines = rawData.trim().split('\n');
    if (lines.length < 2 && hasHeader) return { data: [], keys: [] };
    if (lines.length < 1 && !hasHeader) return { data: [], keys: [] };

    const header = hasHeader ? lines[0].split(',') : ['key', 'value'];
    const dataRows = hasHeader ? lines.slice(1) : lines;

    const data = dataRows.map(line => {
      const values = line.split(',');
      const entry: { [key: string]: string | number } = {};
      entry[header[0]] = values[0];
      entry[header[1]] = parseFloat(values[1]);
      return entry;
    });

    return { data, keys: header };
  }, [rawData, hasHeader]);

  const handleDownload = useCallback(() => {
    triggerHapticFeedback();
    if (chartRef.current) {
      html2canvas(chartRef.current, { backgroundColor: null }).then((canvas: { toDataURL: (arg0: string) => string; }) => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }, []);

  const renderChart = () => {
    if (parsedData.data.length === 0) {
      return <div className="flex items-center justify-center h-full text-gray-500">Enter valid data to generate a chart.</div>;
    }

    const [nameKey, dataKey] = parsedData.keys;

    switch (chartType) {
      case 'bar': {
        return (
          <BarChart data={parsedData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey}><Label value={xAxisLabel} offset={-5} position="insideBottom" /></XAxis>
            <YAxis><Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} /></YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={chartColor} />
          </BarChart>
        );
      }
      case 'line':
        return (
          <LineChart data={parsedData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey}><Label value={xAxisLabel} offset={-5} position="insideBottom" /></XAxis>
            <YAxis><Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} /></YAxis>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={chartColor} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={parsedData.data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={120} fill={chartColor} label>
              {parsedData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Chart & Graph Maker 📊</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Create bar, line, and pie charts from your data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Controls</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Type</label>
                <div className="flex gap-2">
                  <button onClick={() => { setChartType('bar'); triggerHapticFeedback(); }} className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><BarChart2 size={18} /> Bar</button>
                  <button onClick={() => { setChartType('line'); triggerHapticFeedback(); }} className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><LineChartIcon size={18} /> Line</button>
                  <button onClick={() => { setChartType('pie'); triggerHapticFeedback(); }} className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><PieChartIcon size={18} /> Pie</button>
                </div>
              </div>

              <div>
                <label htmlFor="rawData" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data (CSV format)</label>
                <textarea id="rawData" value={rawData} onFocus={triggerHapticFeedback} onChange={e => { setRawData(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="Label,Value&#10;Item A,10&#10;Item B,20" />
              </div>

              <div className="flex items-center">
                <input id="hasHeader" type="checkbox" checked={hasHeader} onChange={e => { setHasHeader(e.target.checked); triggerHapticFeedback(); }} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="hasHeader" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">First row is header</label>
              </div>

              <h3 className="text-xl font-bold pt-4 border-t dark:border-gray-700">Customization</h3>

              <div>
                <label htmlFor="chartTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chart Title</label>
                <input id="chartTitle" type="text" value={chartTitle} onFocus={triggerHapticFeedback} onChange={e => { setChartTitle(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="xAxisLabel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">X-Axis Label</label>
                  <input id="xAxisLabel" type="text" value={xAxisLabel} onFocus={triggerHapticFeedback} onChange={e => { setXAxisLabel(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label htmlFor="yAxisLabel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Y-Axis Label</label>
                  <input id="yAxisLabel" type="text" value={yAxisLabel} onFocus={triggerHapticFeedback} onChange={e => { setYAxisLabel(e.target.value); triggerHapticFeedback(); }} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>

              <div>
                <label htmlFor="chartColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chart Color</label>
                <input id="chartColor" type="color" value={chartColor} onFocus={triggerHapticFeedback} onChange={e => { setChartColor(e.target.value); triggerHapticFeedback(); }} className="mt-1 w-full h-10 p-1 border-none rounded-md cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[400px]">
            <div ref={chartRef}>
              <h2 className="text-center text-2xl font-bold mb-4">{chartTitle}</h2>
              <ResponsiveContainer width="100%" height={400}>
                {renderChart() as React.ReactElement}
              </ResponsiveContainer>
            </div>
            <button onClick={handleDownload} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
              <Download size={18} /> Download as PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartMakerPage;
