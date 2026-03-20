import CryptoJS from 'crypto-js';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ambikaexch.in/extsys';
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || 'F41985E0-D500-4E68-AF71-3701EFC9637A';

export interface ApiResponse<T = any> {
  error: string;
  msg?: string;
  [key: string]: any;
}

/**
 * Standard API request handler for the betting platform
 */
export async function fetchAPI<T = any>(endpoint: string, body: Record<string, any>): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const jsonBody = JSON.stringify(body);
  
  // 🔐 Generate Hash (HMAC SHA256 → Base64)
  const hash = CryptoJS.HmacSHA256(jsonBody, API_SECRET).toString(CryptoJS.enc.Base64);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Hash': hash,
      },
      body: jsonBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Normalize response if needed or just return
    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    return {
      error: '1',
      msg: error instanceof Error ? error.message : 'Unknown network error',
    };
  }
}
