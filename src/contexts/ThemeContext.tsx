import { createContext, ReactNode, useEffect, useState } from "react";

type Theme = {
    darkMode: boolean;
    primary: string;
    primary_2: string;
    secondary: string;
    secondary_2: string;
}
type ThemeContextType = {
    theme: Theme;
    toggleDark:  () => void;
    changeBasicColors: (newPrimary: string, newSecondary: string) => void
};

type ThemeContextProviderProps = {
    children: ReactNode;
};

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
    const [theme, setTheme] = useState<Theme>({
        darkMode: true,
        primary: '#3d99af',
        primary_2: '#3db0cb',
        secondary: '#3daf7b',
        secondary_2: '#338f66'
    });

    useEffect(() => {
    }, [theme]);

    function toggleDark() {
        setTheme(Object.assign(theme, {
            darkMode: !theme.darkMode
        }));
    }

    function changeBasicColors(newPrimary: string, newSecondary: string) {
        setTheme(Object.assign(theme, {
            primary: newPrimary,
            secondary: newSecondary
        }));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleDark, changeBasicColors }}>
            {props.children}
        </ThemeContext.Provider>
    );
}