// Sends HTTP requests to the backend. No business logic — just fetch calls.
// Singleton pattern ensures only one instance is created per page load.
export class AuthApi {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    // Returns the single shared instance (creates it on first call)
    static getInstance(baseUrl = 'http://localhost:8080/api') {
        if (!AuthApi.instance) {
            AuthApi.instance = new AuthApi(baseUrl);
        }
        return AuthApi.instance;
    }
    login(email, password) {
        return this.post('/auth/login', { email, password });
    }
    register(payload) {
        return this.post('/auth/register', payload);
    }
    async post(endpoint, body) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return response.json();
    }
}
