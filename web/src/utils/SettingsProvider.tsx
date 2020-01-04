import { SizeType } from "antd/lib/config-provider/SizeContext";
import React, { useContext, useState } from "react";

interface SettingsValues {
  theme: "light" | "dark";
  menuCollapsed: boolean;
  tableSize: SizeType;
}

interface SettingsFunctions {
  toggleTheme: () => void;
  toggleMenu: () => void;
  setTableSize: (size: SizeType) => void;
}

type Settings = SettingsValues & SettingsFunctions;

const defaultConfig: SettingsValues = {
  theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
  menuCollapsed: localStorage.getItem("menu_collapsed") === "true",
  tableSize: localStorage.getItem("table_size") as SizeType
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
  const [tableSize, _setTableSize] = useState(config.tableSize);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };
  const toggleMenu = () => {
    localStorage.setItem("menu_collapsed", (!menuCollapsed).toString());
    setMenuCollapsed(!menuCollapsed);
  };
  const setTableSize = (size: SizeType) => {
    localStorage.setItem("table_size", size ?? "middle");
    _setTableSize(size);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        menuCollapsed,
        toggleMenu,
        tableSize,
        setTableSize
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
