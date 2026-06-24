// SRP: only responsible for HTTP communication with the backend.
export class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async register(payload) {
        const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return response.json();
    }
}
