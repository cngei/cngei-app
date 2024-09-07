import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    input: 'https://api.cngei.it/v3/api-docs',
    output: 'src/api',
    services: {
        asClass: true,
    }
})