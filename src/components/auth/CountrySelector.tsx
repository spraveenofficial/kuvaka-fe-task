'use client'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { type Country } from '@/lib/countries'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

interface CountrySelectorProps {
    countries: Country[]
    selectedCountry: Country | null
    onSelect: (country: Country) => void
    disabled?: boolean
}

export default function CountrySelector({
    countries,
    selectedCountry,
    onSelect,
    disabled = false,
}: CountrySelectorProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = (country: Country) => {
        onSelect(country)
        setOpen(false)
    }

    return (
        <>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-10"
                onClick={() => setOpen(true)}
                disabled={disabled}
            >
                {selectedCountry ? (
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="truncate">{selectedCountry.name}</span>
                        <span className="text-muted-foreground">({selectedCountry.dialCode})</span>
                    </div>
                ) : (
                    "Select country..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0">
                    <DialogHeader className="px-4 py-3 border-b">
                        <DialogTitle>Select Country</DialogTitle>
                    </DialogHeader>
                    <Command>
                        <CommandInput placeholder="Search countries..." />
                        <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countries.map((country) => (
                                    <CommandItem
                                        key={`${country.code}-${country.dialCode}`}
                                        value={`${country.name} ${country.dialCode} ${country.code}`}
                                        onSelect={() => handleSelect(country)}
                                        className="flex items-center gap-2 p-2"
                                    >
                                        <span className="text-lg">{country.flag}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{country.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {country.dialCode} • {country.code}
                                            </div>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedCountry?.code === country.code
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    )
}