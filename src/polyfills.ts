import 'zone.js';

declare global {
  interface Window {
    global: any;
  }
}
window.global = window;
