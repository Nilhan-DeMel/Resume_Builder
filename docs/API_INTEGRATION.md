# API Integration Guide

Details on the external APIs used in the Resume Builder.

## 1. Anthropic Claude API

Used for CV optimization and rewriting.

### Configuration

1. Get API Key from [Anthropic Console](https://console.anthropic.com).
2. **SECURITY WARNING**: Do not commit this key to Git.
3. In `src/js/config/api.js`:
   - Development: Use a placeholder or environment variable proxy.
   - Production: **MANDATORY** to use a backend proxy (e.g., Supabase Edge Function) to call the API. Client-side calls expose your key.

### Usage

- **Endpoint**: `/v1/messages`
- **Model**: `claude-3-5-sonnet-20240620` (or latest)
- **Role**: System prompt defines ATS expert persona.

## 2. Supabase API

Used for Auth and Storage.

- Interacted with via `supabase-js` client library.
- Secure by design using Row Level Security (RLS) policies.

## Proxy Example (Supabase Edge Function)

To secure the Anthropic Key:

```typescript
// supabase/functions/optimize-cv/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { prompt } = await req.json()
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096
    })
  })
  
  const data = await response.json()
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})
```
