import { TableSize } from "antd/lib/table/interface";
import React, { useContext, useState } from "react";

interface SettingsValues {
  theme: "light" | "dark";
  menuCollapsed: boolean;
  tableSize: TableSize;
}

interface SettingsFunctions {
  toggleTheme: () => void;
  toggleMenu: () => void;
  setTableSize: (size: TableSize) => void;
}

type Settings = SettingsValues & SettingsFunctions;

const defaultConfig: SettingsValues = {
  theme: localStorage.getItem("_theme") === "dark" ? "dark" : "light",
  menuCollapsed: localStorage.getItem("_menu_collapsed") === "true",
  tableSize: localStorage.getItem("_table_size") as TableSize
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
    localStorage.setItem("_theme", newTheme);
    setTheme(newTheme);
  };
  const toggleMenu = () => {
    localStorage.setItem("_menu_collapsed", (!menuCollapsed).toString());
    setMenuCollapsed(!menuCollapsed);
  };
  const setTableSize = (size: TableSize) => {
    localStorage.setItem("_table_size", size);
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
