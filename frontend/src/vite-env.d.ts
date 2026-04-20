/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMUNITY_URL: string
  readonly VITE_SHARE_QR_URL: string
  readonly VITE_GA_MEASUREMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  dataLayer: any[]
  gtag: (...args: any[]) => void
}
