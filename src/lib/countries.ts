export interface Country {
    name: string
    code: string
    dialCode: string
    flag: string
}

export async function fetchCountries(): Promise<Country[]> {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag')
        const data = await response.json()

        const countries: Country[] = data
            .filter((country: any) => country.idd?.root && country.idd?.suffixes)
            .map((country: any) => ({
                name: country.name.common,
                code: country.cca2,
                dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
                flag: country.flag,
            }))
            .filter((country: Country, index: number, array: Country[]) => {
                // Remove duplicates based on country code (keep first occurrence)
                return array.findIndex(c => c.code === country.code) === index
            })
            .sort((a: Country, b: Country) => a.name.localeCompare(b.name))

        return countries
    } catch (error) {
        console.error('Failed to fetch countries:', error)
        // Fallback data
        return [
            { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
            { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
            { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
            { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
            { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
        ]
    }
}

export function simulateOTPSend(phone: string, countryCode: string): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`OTP sent to ${countryCode}${phone}`)
            resolve(true)
        }, 1000)
    })
}

export function simulateOTPVerify(otp: string): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Accept any 6-digit OTP for demo purposes
            resolve(otp.length === 6 && /^\d+$/.test(otp))
        }, 1500)
    })
}