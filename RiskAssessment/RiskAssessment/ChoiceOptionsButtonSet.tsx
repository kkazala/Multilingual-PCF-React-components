import { makeStyles } from "@fluentui/react-components";
import React from "react";
import ChoiceOptionsButton from "./ChoiceOptionsButton";

export type ChoiceOptionsButtonSetProps = {
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    value: number;
    onChange: (newValue: number | undefined) => void;
}

const useStyle = makeStyles({
    buttons:{
        minWidth: "111px",
    }
})


const ChoiceOptionsButtonSet = (props: ChoiceOptionsButtonSetProps) => {
    const { options, value, onChange } = props;
    const styles= useStyle();
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
        <div className={styles.buttons}>
            {getButtons(options, value, onChange)}
        </div>
    )
}
export default ChoiceOptionsButtonSet;