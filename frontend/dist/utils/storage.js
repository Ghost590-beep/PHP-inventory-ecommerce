// Wraps localStorage so every other file uses Storage.get/set instead of localStorage directly.
export class Storage {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            console.warn(`Storage: could not save "${key}"`);
        }
    }
    static get(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
    static clear() {
        localStorage.clear();
    }
}
