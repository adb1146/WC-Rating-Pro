/// <reference types="vite/client" />

declare namespace google.maps {
  export class places {
    static AutocompleteService: new () => AutocompleteService;
    static AutocompleteSessionToken: new () => AutocompleteSessionToken;
    static PlacesService: new (div: HTMLElement) => PlacesService;
    static PlacesServiceStatus: {
      OK: string;
      ZERO_RESULTS: string;
      OVER_QUERY_LIMIT: string;
      REQUEST_DENIED: string;
      INVALID_REQUEST: string;
    };
  }
}

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv