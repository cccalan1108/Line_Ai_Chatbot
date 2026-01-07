import "./.next/types/routes.d.ts";


declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_VERCEL_ENV: 'production' | 'preview' | 'development' | undefined;
    
    readonly LINE_CHANNEL_ACCESS_TOKEN: string;
    readonly LINE_CHANNEL_SECRET: string;
    readonly MONGODB_URI: string;
    readonly GEMINI_API_KEY: string;
    readonly LLM_MODEL_NAME: string;
  }
}