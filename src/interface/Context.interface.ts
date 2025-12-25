
export interface IAuthContext {
    isAuthenticated: boolean
    setIsAuthenticated: (value: boolean) => void
}

export interface IContextProvider {
    children: React.ReactNode
}