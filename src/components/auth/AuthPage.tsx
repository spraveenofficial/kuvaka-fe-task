'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useThemeStore } from '@/store/themeStore'
import { MessageCircle, Moon, Shield, Sparkles, Sun, Zap } from 'lucide-react'
import { useState } from 'react'
import OTPForm from './OTPForm'
import PhoneForm from './PhoneForm'

type AuthStep = 'phone' | 'otp'

export default function AuthPage() {
    const [step, setStep] = useState<AuthStep>('phone')
    const [phoneData, setPhoneData] = useState<{ phone: string; countryCode: string } | null>(null)
    const { isDark, toggleTheme } = useThemeStore()

    const handlePhoneSubmit = (data: { phone: string; countryCode: string }) => {
        setPhoneData(data)
        setStep('otp')
    }

    const handleBackToPhone = () => {
        setStep('phone')
        setPhoneData(null)
    }

    const features = [
        { icon: Shield, text: 'Secure Authentication' },
        { icon: Zap, text: 'Lightning Fast' },
        { icon: Sparkles, text: 'AI Powered' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            {/* Theme Toggle */}
            <div className="absolute top-6 right-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full"
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </div>

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <MessageCircle className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Gemini Chat
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Your intelligent AI conversation companion
                    </p>

                    {/* Features */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-muted-foreground">
                                <feature.icon className="h-4 w-4" />
                                <span className="text-xs font-medium">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Auth Card */}
                <Card className="shadow-lg border">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-bold">
                            {step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
                        </CardTitle>
                        <CardDescription>
                            {step === 'phone'
                                ? 'Enter your phone number to get started with AI conversations'
                                : 'Enter the verification code we sent to your phone'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 'phone' && (
                            <PhoneForm onSubmit={handlePhoneSubmit} />
                        )}

                        {step === 'otp' && phoneData && (
                            <OTPForm
                                phoneData={phoneData}
                                onBack={handleBackToPhone}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border shadow-sm">
                        <p className="text-sm text-muted-foreground mb-2 font-medium">
                            🚀 Demo Experience
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Enter any 6-digit code for OTP verification
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}