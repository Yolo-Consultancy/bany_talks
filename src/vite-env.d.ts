/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YOUTUBE_CHANNEL_ID: string;
  readonly VITE_YOUTUBE_API_KEY: string;
  readonly VITE_PLAYLIST_EMISSIONS_ID: string;
  readonly VITE_PLAYLIST_PODCASTS_ID: string;
  readonly VITE_MAILCHIMP_API_KEY: string;
  readonly VITE_MAILCHIMP_SERVER: string;
  readonly VITE_MAILCHIMP_AUDIENCE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
