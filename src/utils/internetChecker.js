import axios from 'axios';

export async function checkInternet() {
    const healthCheckUrl = `${process.env.CLOUD_HEALTHCHECK_URL}`;
    console.log(`🌐 Checking connection to: ${healthCheckUrl}`);

    try {
        const response = await axios.get(healthCheckUrl, { timeout: 5000 });

        console.log('🌐 Internet check response:', response.status);

        if (response.status === 200) {
            console.log('✅ Internet connection available.');
            return true;
        } else {
            console.warn('⚠️ Unexpected status:', response.status);
            return false;
        }
    } catch (error) {
        console.warn('❌ Internet check failed:', error.message);
        return false;
    }
}
