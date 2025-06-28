// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        "icons/apple-touch-icon.png",
      ],
      manifest: {
        name: "Expiry Tracker",
        short_name: "ExpiryApp",
        description: "Track product expiry easily!",
        theme_color: "#3f51b5",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "icons/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
