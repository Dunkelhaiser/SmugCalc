import { useContext } from "react";
import { CalculationContext } from "../CalculationsContext";

interface Button {
    type: string;
    label: string;
    className?: string;
}

const ActionBtn: React.FC<Button> = ({ type, label, className }) => {
    const { clear, remove, calculate, setModule, updateCalc, setFraction, getRandom } = useContext(CalculationContext);
    let action;
    if (type === "clear") {
        action = clear;
    } else if (type === "remove") {
        action = remove;
    } else if (type === "calculate") {
        action = calculate;
    } else if (type === "module") {
        action = setModule;
    } else if (type === "power") {
        action = () => updateCalc("**");
    } else if (type === "fraction") {
        action = setFraction;
    } else if (type === "random") {
        action = getRandom;
    }
    return (
        <button className={className} type="button" onClick={action}>
            {label}
        </button>
    );
};
export default ActionBtn;
