import {useContext} from "react";
import {ThemeContext} from "./ThemeContext";

export default function ThemeToggle() {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <button className="btn btn-outline-secondary" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}