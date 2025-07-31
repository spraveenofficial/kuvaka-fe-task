'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { simulateOTPVerify } from '@/lib/countries'
import { otpSchema, type OtpFormData } from '@/lib/validations'
import { useAuthStore } from '@/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface OTPFormProps {
    phoneData: { phone: string; countryCode: string }
    onBack: () => void
}

export default function OTPForm({ phoneData, onBack }: OTPFormProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const { login } = useAuthStore()

    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    })

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus()
    }, [])

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedOtp = value.slice(0, 6).split('')
            const newOtp = [...otp]

            pastedOtp.forEach((digit, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = digit
                }
            })

            setOtp(newOtp)
            setValue('otp', newOtp.join(''))

            // Focus last filled input or next empty one
            const nextIndex = Math.min(index + pastedOtp.length, 5)
            inputRefs.current[nextIndex]?.focus()
            return
        }

        // Handle single digit
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            setValue('otp', newOtp.join(''))

            // Move to next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleFormSubmit = async () => {
        const otpValue = otp.join('')

        if (otpValue.length !== 6) {
            toast.error('Please enter complete OTP')
            return
        }

        setLoading(true)

        try {
            const isValid = await simulateOTPVerify(otpValue)

            if (isValid) {
                const user = {
                    id: Math.random().toString(36).substr(2, 9),
                    phone: phoneData.phone,
                    countryCode: phoneData.countryCode,
                }

                login(user)
                toast.success('Login successful!')
            } else {
                toast.error('Invalid OTP. Please try again.')
                setOtp(['', '', '', '', '', ''])
                inputRefs.current[0]?.focus()
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <p className="text-sm text-muted-foreground">
                        Code sent to {phoneData.countryCode} {phoneData.phone}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-center block">Enter 6-digit verification code</Label>

                <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-lg font-semibold"
                        />
                    ))}
                </div>

                {errors.otp && (
                    <p className="text-sm text-destructive text-center">
                        {errors.otp.message}
                    </p>
                )}

                <Button
                    onClick={handleFormSubmit}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loading || otp.join('').length !== 6}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Verify OTP'
                    )}
                </Button>
            </div>

            <div className="text-center">
                <Button
                    variant="link"
                    onClick={onBack}
                    className="text-muted-foreground"
                >
                    Change phone number
                </Button>
            </div>
        </div>
    )
}