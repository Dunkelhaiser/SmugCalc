import { useContext } from "react";
import { CalculationContext } from "../CalculationsContext";

interface Button {
    input: string;
    className?: string;
}

const InputBtn: React.FC<Button> = ({ input, className }) => {
    const { updateCalc } = useContext(CalculationContext);
    return (
        <button className={className} type="button" onClick={() => updateCalc(input)}>
            {input}
        </button>
    );
};
export default InputBtn;
