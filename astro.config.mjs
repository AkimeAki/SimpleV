import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

const site = "https://simple-v.aki.wtf";

// https://astro.build/config
export default defineConfig({
    server: {
        port: 14501,
        host: "0.0.0.0"
    },
    site,
    trailingSlash: "never",
    integrations: [sitemap({
        filter: (page) => {
            if (page === `${site}/view`) {
                return false;
            }

            return true;
        }
		}), react()],
    build: {
        format: "file"
    },
    vite: {
        define: {
            global: "window"
        }
    }
});