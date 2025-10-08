# Google Maps API Setup

To enable address autocomplete functionality in the business form, you need to set up a Google Maps API key.

## Steps to Setup

### 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Maps JavaScript API**
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. API Restrictions (Recommended)

For security, restrict your API key to:
- **HTTP referrers**: Your domain (e.g., `localhost:3000/*`, `yourdomain.com/*`)
- **APIs**: Only the APIs you need (Places API, Maps JavaScript API)

### 4. Features Enabled

With this setup, the business form will have:
- **Address Autocomplete**: Type to get suggestions from Google Places
- **Country Restriction**: Limited to South Africa (ZA)
- **Formatted Addresses**: Consistent address formatting
- **Loading States**: Visual feedback during API loading

### 5. Fallback Behavior

If the Google Maps API key is not provided or fails to load:
- The address field will still work as a regular text input
- Users can manually type their address
- A helpful message will indicate that autocomplete is not available

## Cost Considerations

- Google Maps API has a free tier with generous limits
- Address autocomplete typically costs $0.00283 per session
- Monitor usage in the Google Cloud Console
- Set up billing alerts to avoid unexpected charges
