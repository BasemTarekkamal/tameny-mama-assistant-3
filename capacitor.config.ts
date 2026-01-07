import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'app.lovable.eec32f625c27464b83884c2850671b26',
    appName: 'Tameny Mama',
    webDir: 'dist',
    // Copied from clinc-os, keeping the same server URL for now as it seems to be the production URL
    server: {
        url: 'https://eec32f62-5c27-464b-8388-4c2850671b26.lovableproject.com?forceHideBadge=true',
        cleartext: true
    }
};

export default config;
