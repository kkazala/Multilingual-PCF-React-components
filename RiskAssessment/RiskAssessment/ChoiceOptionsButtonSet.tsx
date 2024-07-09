import React from "react";
import ChoiceOptionsButton from "./ChoiceOptionsButton";

export type ChoiceOptionsButtonSetProps = {
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    value: number;
    onChange: (newValue: number | undefined) => void;
}
const ChoiceOptionsButtonSet = (props: ChoiceOptionsButtonSetProps) => {
    const { options, value, onChange } = props;
    const getButtons = (options: ComponentFramework.PropertyHelper.OptionMetadata[], value: number | null, onChange: (newValue: number | undefined) => void) => {
        return options.map((item) => {
            return (
                <ChoiceOptionsButton
                    key={`btn${item.Value}`}
                    item={item}
                    checked={item.Value == value}
                    onChange={onChange}
                />)
        })
    }
    return (
        <div>
            {getButtons(options, value, onChange)}
        </div>
    )
}
export default ChoiceOptionsButtonSet;