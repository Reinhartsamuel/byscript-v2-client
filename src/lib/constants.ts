export const BASE_URL = (import.meta.env.VITE_APP_MODE && import.meta.env.VITE_APP_MODE === 'dev' ?
    import.meta.env.VITE_API_URL_DEV :
    import.meta.env.VITE_API_URL);
