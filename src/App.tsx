import "./scss/global.scss";
import "./scss/calculator.scss";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons";
import { ReactFontSizeByTextLength } from "react-font-size-by-text-length";
import InputBtn from "./components/InputBtn";
import ActionBtn from "./components/ActionBtn";
import { CalculationContext } from "./CalculationsContext";

function App() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { calc, result } = useContext(CalculationContext);
    const [expanded, setExpand] = useState(false);

    const setThemeStorage = (selectedTheme: string) => {
        localStorage.setItem("theme", selectedTheme);
    };
    const setThemeHandler = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    useEffect(() => {
        setThemeStorage(theme);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.querySelector('meta[name="theme-color"]')!.setAttribute("content", theme === "light" ? "#e7e7e7" : "#1a1c22");
    }, [theme]);

    const expand = () => {
        setExpand((prev) => !prev);
    };

    return (
        <div className="app" id={theme}>
            <div className="calculator">
                <button type="button" onClick={setThemeHandler} className="theme-btn" aria-label="Theme Button">
                    {theme === "light" ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
                </button>
                <section className="calculations">
                    <span className="preview">({result || 0})</span>
                    <ReactFontSizeByTextLength changePerChar={5} startAtChar={12} minPercent={50}>
                        <span>{calc || 0}</span>
                    </ReactFontSizeByTextLength>
                </section>
                <div>
                    <section className={expanded ? "panel-expanded" : "panel"}>
                        <ActionBtn type="clear" label="AC" />
                        <ActionBtn type="remove" label="C" />
                        <InputBtn input="%" />
                        {expanded && <ActionBtn type="fraction" label="1/x" />}
                        <ActionBtn type="calculate" label="=" />
                        {expanded && <InputBtn input="(" />}
                        {expanded && <InputBtn input=")" />}
                        {expanded && <InputBtn input="!" />}
                        {expanded && <InputBtn input="√" />}
                        {expanded && <InputBtn input="^" />}
                        <InputBtn input="7" />
                        <InputBtn input="8" />
                        <InputBtn input="9" />

                        {expanded && <InputBtn input="π" />}

                        <InputBtn input="+" />
                        <InputBtn input="4" />
                        <InputBtn input="5" />
                        <InputBtn input="6" />

                        {expanded && <InputBtn input="e" />}

                        <InputBtn input="-" />
                        <InputBtn input="1" />
                        <InputBtn input="2" />
                        <InputBtn input="3" />

                        {expanded && <ActionBtn type="module" label="||" />}

                        <InputBtn input="*" />
                        <button type="button" onClick={expand} aria-label="Expand">
                            {expanded === false ? <FontAwesomeIcon icon={faExpand} /> : <FontAwesomeIcon icon={faMinimize} />}
                        </button>
                        <InputBtn input="0" />
                        <InputBtn input="." />
                        {expanded && <ActionBtn type="random" label="rng" />}
                        <InputBtn input="÷" />
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;
