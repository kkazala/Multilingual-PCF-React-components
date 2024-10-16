import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
import * as React from 'react';
import { Utils } from "../../_Utils";

export interface IButtonToggleProps {
    item: ComponentFramework.PropertyHelper.OptionMetadata
    checked?: boolean;
    onChange: (newValue: number | undefined) => void;
}

type btnProperties = {
    text: string;
    onClick: () => void;
    className:string;
    appearance:  "primary" | "outline" | "subtle" | "transparent" | undefined;
}
const useStyles = makeStyles({
    checked: {
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
    },
    default: {
        backgroundColor: tokens.colorNeutralBackground1,
        color: tokens.colorNeutralForeground1,
    },
});

const ButtonToggle = (props: IButtonToggleProps) => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState<boolean>(false);
    const [btnProps, setBtnProps] = React.useState<btnProperties>();

    const toggleChecked = (buttonIndex: number) => {
        setChecked;
        props.onChange(buttonIndex)
    };

    const buttonBackgroundStyle = React.useMemo(() => ({
        ['backgroundColor']: props.item.Color,
        ["color"]: Utils.GetContrastingColor(props.item.Color),
    }), [props.item.Color])

    React.useEffect(() => {

        const btnProps: btnProperties = {
            text: props.item.Label,
            onClick: () => toggleChecked(props.item.Value),
            className: props.checked ? styles.checked : styles.default,
            appearance: props.checked ? "primary" : "outline",
        };
        setBtnProps(btnProps);

    }, []);

    React.useEffect(() => {
        setChecked(props.checked ?? false);
    }, [props.checked]);

    return (<>
        {btnProps &&
            <ToggleButton
                key={props.item.Value}
                checked={checked}
                {...btnProps}
                style={checked ?buttonBackgroundStyle as React.CSSProperties:{}}
            >{btnProps.text}</ToggleButton>
            }
        </>
    );
};

export default ButtonToggle;