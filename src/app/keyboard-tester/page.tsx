'use client';

import { useState, useEffect, useCallback } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

// --- Keyboard Layout Data ---
const KEY_LAYOUT = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight']
];

const KEY_DISPLAY: Record<string, string> = {
  Backquote: '`', Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5', Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0', Minus: '-', Equal: '=', Backspace: 'Backspace',
  Tab: 'Tab', KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y', KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P', BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  CapsLock: 'Caps Lock', KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyJ: 'J', KeyK: 'K', KeyL: 'L', Semicolon: ';', Quote: "'", Enter: 'Enter',
  ShiftLeft: 'Shift', KeyZ: 'Z', KeyX: 'X', KeyC: 'C', KeyV: 'V', KeyB: 'B', KeyN: 'N', KeyM: 'M', Comma: ',', Period: '.', Slash: '/', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', MetaLeft: 'Win', AltLeft: 'Alt', Space: 'Space', AltRight: 'Alt', MetaRight: 'Win', ContextMenu: 'Menu', ControlRight: 'Ctrl'
};

const KEY_WIDTH: Record<string, string> = {
  Backspace: 'flex-grow-[2]', Tab: 'flex-grow-[1.5]', Backslash: 'flex-grow-[1.5]',
  CapsLock: 'flex-grow-[1.7]', Enter: 'flex-grow-[2.3]',
  ShiftLeft: 'flex-grow-[2.5]', ShiftRight: 'flex-grow-[2.5]',
  Space: 'flex-grow-[8]'
};

const KeyboardTesterPage = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile user agent on the client side
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressedKeys(prev => new Set(prev).add(e.code));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      return newSet;
    });
  }, []);

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isMobile, handleKeyDown, handleKeyUp]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Keyboard Tester ⌨️</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Press any key to see it light up on the virtual keyboard.</p>
      </div>

      {isMobile ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-6 rounded-r-lg shadow-md text-center">
          <Smartphone className="mx-auto w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold">Mobile Device Detected</h2>
          <p className="mt-2">This tool is designed for testing physical keyboards and is best experienced on a desktop, laptop, or PC.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="space-y-1 sm:space-y-2">
            {KEY_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 sm:gap-2 w-full">
                {row.map(keyCode => {
                  const isPressed = pressedKeys.has(keyCode);
                  return (
                    <div
                      key={keyCode}
                      className={`
                        h-12 sm:h-16 flex-1 flex items-center justify-center p-1 text-xs sm:text-base font-semibold border-b-4 rounded-md transition-all duration-75
                        ${isPressed
                          ? 'bg-blue-500 text-white border-blue-700 dark:bg-blue-600 dark:border-blue-800 transform scale-95'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-900'
                        }
                        ${KEY_WIDTH[keyCode] || ''}
                      `}
                    >
                      {KEY_DISPLAY[keyCode] || keyCode}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardTesterPage;
