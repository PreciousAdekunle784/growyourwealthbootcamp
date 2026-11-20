interface ImportMetaEnv {
  readonly PUBLIC_CHECKOUT_URL?: string;
  readonly PUBLIC_WAITLIST_ENDPOINT?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
  readonly PUBLIC_GOOGLE_ADS_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
