export const triggerHapticFeedback = () => {
  const hapticEnabled = JSON.parse(localStorage.getItem('hapticFeedback') || 'false');
  const intensity = parseFloat(localStorage.getItem('hapticIntensity') || '0.2');

  if (hapticEnabled && navigator.vibrate) {
    try {
      // The vibration duration can be linked to the intensity
      const duration = Math.max(50, Math.round(intensity * 150));
      navigator.vibrate(duration);
    } catch (error) {
      console.error("Vibration failed:", error);
    }
  }
};
