import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plant Care App",
    short_name: "Plant Care",
    description:
      "A personal plant care app for tracking watering, rooms, photos, and notes.",
    start_url: "/app?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#FBF8F1",
    theme_color: "#145A5D",
    icons: [
      {
        src: "/icons/plant-care-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/plant-care-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/plant-care-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
