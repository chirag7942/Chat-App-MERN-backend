import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",  // Default to "coffee" if no theme is stored
    setTheme: (theme) => {
      // Only set the theme in localStorage if it's a valid theme from your list
      const validThemes = [
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter",
        "dim",
        "nord",
        "sunset",
      ];
  
      if (validThemes.includes(theme)) {
        localStorage.setItem("chat-theme", theme);  // Only set valid themes
        set({ theme });  // Update Zustand store
      } else {
        console.warn(`Invalid theme: ${theme}`);
      }
    },
  }));
  