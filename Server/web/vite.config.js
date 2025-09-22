import { defineConfig } from "vite";

export default defineConfig({
    root: ".",              // index.html is here
    build: {
        outDir: "dist",        // output folder
        emptyOutDir: true
    }
});