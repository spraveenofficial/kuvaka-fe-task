'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchCountries, simulateOTPSend, type Country } from '@/lib/countries'
import { phoneSchema, type PhoneFormData } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CountrySelector from './CountrySelector'

interface PhoneFormProps {
    onSubmit: (data: { phone: string; countryCode: string }) => void
}

export default function PhoneForm({ onSubmit }: PhoneFormProps) {
    const [countries, setCountries] = useState<Country[]>([])
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [loading, setLoading] = useState(false)
    const [countriesLoading, setCountriesLoading] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
    })

    const countryCode = watch('countryCode')

    useEffect(() => {
        const loadCountries = async () => {
            setCountriesLoading(true)
            const countryData = await fetchCountries()
            setCountries(countryData)

            // Set default to US
            const defaultCountry = countryData.find(c => c.code === 'US') || countryData[0]
            if (defaultCountry) {
                setSelectedCountry(defaultCountry)
                setValue('countryCode', defaultCountry.dialCode)
            }
            setCountriesLoading(false)
        }

        loadCountries()
    }, [setValue])

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country)
        setValue('countryCode', country.dialCode)
    }

    const handleFormSubmit = async (data: PhoneFormData) => {
        setLoading(true)

        try {
            const success = await simulateOTPSend(data.phone, data.countryCode)

            if (success) {
                toast.success('OTP sent successfully!')
                onSubmit(data)
            } else {
                toast.error('Failed to send OTP. Please try again.')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <CountrySelector
                    countries={countries}
                    selectedCountry={selectedCountry}
                    onSelect={handleCountrySelect}
                    disabled={countriesLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        {...register('phone')}
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        className="pl-10"
                    />
                </div>
                {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
            </div>

            <input type="hidden" {...register('countryCode')} />

            <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading || !selectedCountry || countriesLoading}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                    </>
                ) : (
                    'Send OTP'
                )}
            </Button>
        </form>
    )
}