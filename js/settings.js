import { getSettings, saveSettings } from "./database.js";

const THEMES = new Set(["dark", "light"]);

function normalizeTheme(theme) {
  return THEMES.has(theme) ? theme : "dark";
}

export async function getTheme() {
  const settings = await getSettings();
  return normalizeTheme(settings.theme);
}

export async function saveTheme(theme) {
  const settings = await getSettings();
  await saveSettings({ ...settings, theme: normalizeTheme(theme) });
}
