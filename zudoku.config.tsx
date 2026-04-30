import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  site: {
    logo: {
      src: { light: "logo-light.svg", dark: "logo-dark.svg" },
      alt: "Project Documentation",
      width: "130px",
    },
    title: "Project Docs",
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [
            "/introduction",
            "/installation",  
            "/authorization", 
          ],
        },
        {
          type: "category",
          label: "Кваліфікаційна робота",
          icon: "book",
          items: [
            {
              type: "link",
              label: "Технічне завдання (SRS)",
              to: "/srs",
            },
          ],
        },
        // -----------------------------
        {
          type: "category",
          label: "Resources",
          icon: "hotel",
          items: [
            {
              type: "link",
              label: "API Reference",
              to: "/api",
              icon: "folder-cog",
            },
          ],
        },
        {
          type: "category",
          label: "Project Info",
          icon: "user",
          items: [
            "/about", 
          ],
        },
      ],
    },
    {
      type: "link",
      label: "About",
      to: "/about",
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
    },
  ],
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "./apis/openapi.yaml",
      path: "/api",
    },
  ],
};

export default config;