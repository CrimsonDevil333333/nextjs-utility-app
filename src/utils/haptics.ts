export const triggerHapticFeedback = () => {
  // Check if the code is running in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Check if the currently focused element is a text input field
  const activeElement = document.activeElement;
  const isTyping = activeElement && 
    (activeElement.tagName === 'INPUT' || 
     activeElement.tagName === 'TEXTAREA' || 
     (activeElement as HTMLElement).contentEditable === 'true');

  // Do not trigger haptic feedback if the user is typing
  if (isTyping) {
    return;
  }

  const hapticEnabled = JSON.parse(localStorage.getItem('hapticFeedback') || 'false');
  const intensity = parseFloat(localStorage.getItem('hapticIntensity') || '0.2');

  if (hapticEnabled && navigator.vibrate) {
    try {
      const duration = Math.max(50, Math.round(intensity * 150));
      navigator.vibrate(duration);
    } catch (error) {
      console.error("Vibration failed:", error);
    }
  }
};