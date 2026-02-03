import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { theme, app, pwa } from './src/config/constants.js';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // const env = process?.env || {};
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ["assets/*.png", "assets/*.jpg", "assets/*.svg", "assets/*.pdf"],
        manifest: {
          name: app.name,
          short_name: app.shortName,
          description: app.description,
          theme_color: theme.colors.secondary,
          background_color: theme.colors.primary,
          display: pwa.display,
          start_url: pwa.startUrl,
          lang: app.lang,
          icons: [
            {
              src: "assets/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "assets/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "assets/apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png"
            }
          ],
          screenshots: [
            {
              src: "assets/Screenshot1.png",
              sizes: "538x1046",
              type: "image/png"
            },
            {
              src: "assets/Screenshot2.png",
              sizes: "2372x1266",
              type: "image/png"
            }
          ]
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/translate\.googleapis\.com\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "google-translate-cache",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache external PDF resources from ilrc.org
              urlPattern: /^https:\/\/www\.ilrc\.org\/.*\.pdf$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "external-pdfs-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 90 // 90 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: process.env.NODE_ENV === "production",
          type: "module"
        }
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          additionalData: `@import "./src/scss/variables.scss";`,
        },
      },
    },


    // base url should be /RedCards/ for gh-pages and / for development
    // base: env.VITE_APP_ENV === "production" ? "/RedCards/" : "/",
  };
});
