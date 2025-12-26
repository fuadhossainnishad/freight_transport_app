import { createContext, useContext, useState } from "react";
import { IThemeContext, IContextProvider, TThemeMode } from '../../types/Context.interface';
import { useColorScheme } from "react-native";
import { Theme } from 'nativewind'
const ThemeContext = createContext<IThemeContext | null>(null)

export const ThemeProvider = ({ children }: IContextProvider) => {
    const systemTheme = useColorScheme()
    const [mode, setMode] = useState<TThemeMode>('system')
    const theme = mode === 'system' ? systemTheme || 'light' : mode

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setMode }} >
            {children}
        </ThemeContext.Provider >
    )
}

export const useTheme = () => {
    const theme = useContext(ThemeContext)
    if (!theme) throw new Error('useTheme must use on a themeProvider')
    return theme;
}