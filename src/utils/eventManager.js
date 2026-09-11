// Centralized Event Manager for MalayaliOS Nature & Chaos System
class CentralEventManager {
  constructor() {
    this.activeEvents = new Set();
    this.cooldowns = new Map();
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.listeners.forEach((listener) => listener(event, payload));
  }

  canTrigger(eventName, cooldownMs = 5000) {
    if (this.activeEvents.has(eventName)) return false;
    const lastTrigger = this.cooldowns.get(eventName) || 0;
    if (Date.now() - lastTrigger < cooldownMs) return false;
    return true;
  }

  trigger(eventName, payload = {}) {
    if (this.activeEvents.has(eventName)) {
      console.warn(`[EventManager] Event "${eventName}" is already running.`);
      return false;
    }

    this.activeEvents.add(eventName);
    this.cooldowns.set(eventName, Date.now());
    this.notify('EVENT_START', { eventName, payload });

    return true;
  }

  finish(eventName, payload = {}) {
    if (this.activeEvents.has(eventName)) {
      this.activeEvents.delete(eventName);
      this.notify('EVENT_END', { eventName, payload });
    }
  }

  isEventActive(eventName) {
    return this.activeEvents.has(eventName);
  }

  clearAll() {
    this.activeEvents.clear();
    this.notify('EVENT_RESET', {});
  }
}

export const eventManager = new CentralEventManager();
