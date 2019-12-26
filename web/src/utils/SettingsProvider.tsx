import React, { useContext, useState } from "react";

interface SettingsValues {
  theme: "light" | "dark";
  menuCollapsed: boolean;
}

interface SettingsFunctions {
  toggleTheme: () => void;
  toggleMenu: () => void;
}

type Settings = SettingsValues & SettingsFunctions;

const defaultConfig: SettingsValues = {
  theme: localStorage.getItem("_theme") === "dark" ? "dark" : "light",
  menuCollapsed: false
};

const SettingsContext = React.createContext<Settings>(defaultConfig as any);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<Partial<Settings>> = ({
  children,
  ...props
}) => {
  const config: SettingsValues = { ...defaultConfig, ...props };

  const [theme, setTheme] = useState<"light" | "dark">(config.theme);
  const [menuCollapsed, setMenuCollapsed] = useState(config.menuCollapsed);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("_theme", newTheme);
    setTheme(newTheme);
  };
  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        menuCollapsed,
        toggleMenu
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
