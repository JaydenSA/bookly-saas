'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink } from 'lucide-react';
import { AddressInputProps } from '@/types';

export default function AddressInput({
  value,
  onChange,
  placeholder = "Enter address",
  label = "Address",
  required = false,
  id = "address"
}: AddressInputProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const openGoogleMaps = () => {
    if (value.trim()) {
      const encodedAddress = encodeURIComponent(value);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      // Open Google Maps with a general search
      const googleMapsUrl = 'https://www.google.com/maps';
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={id}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className="pl-10"
            autoComplete="off"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={openGoogleMaps}
          title="Open in Google Maps"
          className="shrink-0"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Type your address and click the map icon to verify it in Google Maps
      </p>
    </div>
  );
}
