import { evaluate, random, floor } from "mathjs";
import { createContext, useEffect, useMemo, useState } from "react";

type CalculationsContextType = {
    calc: string;
    result: number;
    updateCalc: (value: string) => void;
    calculate: () => void;
    remove: () => void;
    clear: () => void;
    setModule: () => void;
    setFraction: () => void;
    getRandom: () => void;
};

interface Props {
    children: React.ReactNode;
}

const iCalculationsContextState = {
    calc: "",
    result: 0,
    updateCalc: () => {},
    calculate: () => {},
    remove: () => {},
    clear: () => {},
    setModule: () => {},
    setFraction: () => {},
    getRandom: () => {},
};

export const CalculationContext = createContext<CalculationsContextType>(iCalculationsContextState);

export const CalculationContextProvider: React.FC<Props> = ({ children }) => {
    const [calc, setCalc] = useState<string>("");
    const [result, setResult] = useState<number>(0);

    const operators = ["÷", "*", "+", "-", ".", "^"];

    const evaluation = () => {
        const evaluated: number = evaluate(
            calc
                .replaceAll("÷", "/")
                .replaceAll(/√(\d+|e|π|\((.+?)\))/g, "sqrt($1)")
                .replaceAll(/\|([^|]+)\|/g, "abs($1)")
                .replaceAll("π", "pi")
                .replaceAll("/0", "NaN")
        );
        return typeof evaluated === "number" ? evaluated : NaN;
    };

    useEffect(() => {
        try {
            setResult(evaluation());
        } catch (err) {}
    }, [calc]);

    const handleKeyDown = (e: KeyboardEvent) => {
        const allowedKeys = new Set(["^", "+", "-", "*", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "%", "!", "(", ")"]);
        const keyMap = new Map([
            ["/", "÷"],
            ["\\", "√"],
            ["p", "π"],
            ["з", "π"],
            ["п", "π"],
            ["e", "e"],
            ["у", "e"],
            ["е", "e"],
        ]);
        if (allowedKeys.has(e.key)) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            updateCalc(e.key);
        } else {
            switch (e.key) {
                case "Backspace":
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    remove();
                    break;
                case "=":
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    calculate();
                    break;
                case "Delete":
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    clear();
                    break;
                case "|":
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    setModule();
                    break;
                default:
                    if (keyMap.has(e.key)) {
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define, @typescript-eslint/no-non-null-assertion
                        updateCalc(keyMap.get(e.key)!);
                    }
                    break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const moreOpenThanClose = (str: string) =>
        // eslint-disable-next-line no-param-reassign
        str.split("").reduce((total, char) => (char === "(" ? ++total : char === ")" ? --total : total), 0) > 0;

    const updateCalc = (value: string) => {
        if (
            (operators.includes(value) && (calc === "" || calc.lastIndexOf("(") === calc.length - 1) && value !== "√" && value !== "-") ||
            (calc.endsWith("√") && value === "√") ||
            (calc.endsWith("√") && operators.includes(value)) ||
            (calc.endsWith("e") && value === "e") ||
            (calc.endsWith("π") && value === "π") ||
            (calc.endsWith("π") && value === ".") ||
            (calc.endsWith("π") && !operators.includes(value) && value !== "(" && value !== ")") ||
            (calc.endsWith("e") && value === ".") ||
            (calc.endsWith("e") && !operators.includes(value) && value !== "(" && value !== ")") ||
            (calc.match(/[+\-/*^.√!]$|^$/) && value === "!") ||
            (calc.match(/[0-9]*\.[0-9]+$/) && value === ".") ||
            (calc.match(/[0-9]%$/) && value === "%") ||
            (calc.length === 0 && value === "%") ||
            ((!calc.match(/[0-9]$|e$|π$|!$|[)]$/) || !moreOpenThanClose(calc)) && value === ")") ||
            (operators.includes(calc[calc.length - 1]) && value === "%") ||
            (calc.slice(-1) === "-" && operators.includes(value)) ||
            (operators.includes(value) && operators.includes(calc.slice(-1)) && value === ".")
        )
            return;
        if (
            (operators.includes(value) && operators.includes(calc.slice(-1)) && value !== "-") ||
            (/(\+|\|\*|\/)0$/.test(calc) && !operators.includes(value) && value !== "-")
        ) {
            setCalc((prev) => prev.slice(0, -1) + value);
        } else if (calc.length === 1 && calc[0] === "0" && !operators.includes(value)) {
            setCalc(value);
        } else {
            setCalc((prev) => prev + value);
        }
    };

    const calculate = () => {
        if (calc.length > 0) setCalc(evaluation().toString());
    };

    const remove = () => {
        if (calc.endsWith("NaN") || calc.endsWith("Infinity")) {
            setCalc(calc.replace(/NaN$|Infinity$/, ""));
        } else {
            setCalc(calc.slice(0, -1));
        }
    };

    const clear = () => {
        setCalc("");
    };

    const setModule = () => {
        if (calc.match(/[0-9+\-/*^eπ.√!]$|^$/)) {
            setCalc((prev) => `${prev}|`);
        }
    };

    const setFraction = () => {
        const regex = /(\d+|e|π|\((.+?)\))$/;
        if (calc.match(regex)) {
            const invertedNumber = `(1/${calc.match(regex)?.[0]})`;
            setCalc(calc.replace(regex, invertedNumber));
        }
    };

    const getRandom = () => {
        setCalc((prev) => prev + floor(random(100)));
    };

    const values = useMemo(
        () => ({
            calc,
            result,
            updateCalc,
            calculate,
            remove,
            clear,
            setModule,
            setFraction,
            getRandom,
        }),
        [calc, result]
    );

    return <CalculationContext.Provider value={values}>{children}</CalculationContext.Provider>;
};
