
export interface IAuthContext {
    isAuthenticated: boolean
    setIsAuthenticated: (value: boolean) => void
}

export type TThemeMode = 'light' | 'dark' | 'system'
export interface IThemeContext {
    theme: 'light' | 'dark'
    setTheme: (mode: TThemeMode) => void
}

export interface IContextProvider {
    children: React.ReactNode
}