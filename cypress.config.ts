import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000', // La URL de tu Shell MFE
    viewportWidth: 1280, // Tamaño de pantalla de una laptop estándar
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});