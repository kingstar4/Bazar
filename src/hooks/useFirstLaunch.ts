import {useEffect, useState}from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFirstLaunch = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(()=>{
        const checkFirstLaunch = async () => {
            try {
                const hasLaunched = await AsyncStorage.getItem('hasLaunched');
                if (hasLaunched === null) {
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (error) {
                setIsFirstLaunch(false); // Fallback to false on error
                console.error('Error checking first launch:', error);
            }
        };

        checkFirstLaunch();
    }, []);

    return isFirstLaunch;
};

export default useFirstLaunch;

