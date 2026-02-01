import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

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
          name: "Red Cards",
          short_name: "redcards",
          description: "This is a digital version of the 'Red Cards' created by the Immigration Legal Resource Center.",
          theme_color: "#B11111",
          background_color: "#FFFFFF",
          display: "fullscreen",
          start_url: "/",
          lang: "en",
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
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,pdf}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
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
                  maxEntries: 10,
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
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
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
