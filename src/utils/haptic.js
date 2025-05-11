export function vibrate(duration) {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }