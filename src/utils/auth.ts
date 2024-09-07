import axios, { AxiosError } from 'axios';
import { client } from '../api';

const authUrl = 'https://auth.cngei.it/auth/realms/cngei/protocol/openid-connect/token';

export async function login(username: string, password: string): Promise<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'sc');
    params.append('username', username);
    params.append('password', password);

    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login error:', errorText);
            throw new Error('Login failed');
        }

        const data = await response.json();
        client.interceptors.request.use((config: any) => {
            config.headers.set('Authorization', `Bearer ${data.access_token}`);
            return config;
        });
        return data.access_token;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}


