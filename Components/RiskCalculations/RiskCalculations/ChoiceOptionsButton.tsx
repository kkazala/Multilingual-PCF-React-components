import { ToggleButton, Tooltip, makeStyles, tokens } from '@fluentui/react-components';
import { CheckboxCheckedRegular, CheckboxUncheckedRegular } from '@fluentui/react-icons';
import Color from 'color';
import * as React from 'react';

export type ChoiceOptionsButtonProps= {
    item: ComponentFramework.PropertyHelper.OptionMetadata
    checked?: boolean;
    onChange: (newValue: number | undefined) => void;
}

type btnProperties = {
    text: string;
    onClick: () => void;
    className:string;
    appearance?:  "primary" | "outline" | "subtle" | "transparent" | undefined;
    icon?: JSX.Element;
}
const useStyles = makeStyles({
    checked: {
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        marginRight: "5px",
    },
    default: {
        backgroundColor: tokens.colorNeutralBackground1,
        color: tokens.colorNeutralForeground1,
        marginRight: "5px",
    },

});
const getContrastingColor = (colorRGBA: string) => {

    const color = Color(colorRGBA);
    if (color.isLight()) {
        return color.darken(0.5)
    }
    else if (color.isDark()) {
        return color.lighten(0.8)
    }

}

const ChoiceOptionsButton = (props: ChoiceOptionsButtonProps):JSX.Element => {
    const styles = useStyles();
    const [checked, setChecked] = React.useState<boolean>(props.checked ?? false);
    const [btnProps, setBtnProps] = React.useState<btnProperties>();

    const toggleChecked = (buttonIndex: number) => {
        setChecked;
        props.onChange(buttonIndex)
    };

    const buttonBackgroundStyle = React.useMemo(() => ({
        ['backgroundColor']: props.item.Color ?? tokens.colorNeutralBackground3,
        ["color"]: props.item.Color ? getContrastingColor(props.item.Color) : tokens.colorNeutralForeground3,
    }), [props.item.Color])

    React.useEffect(() => {

        const btnProps: btnProperties = {
            text: props.item.Label,
            onClick: () => toggleChecked(props.item.Value),
            className: props.checked ? styles.checked : styles.default,
            // appearance: props.checked ? "primary" : "outline",
        };
        setBtnProps(btnProps);

    }, []);


    return (<>
        {btnProps &&
        <Tooltip content={btnProps.text} relationship='description'>
            <ToggleButton
                key={props.item.Value}
                checked={checked}
                    icon={checked ? <CheckboxCheckedRegular /> : <CheckboxUncheckedRegular />}
                {...btnProps}
                style={buttonBackgroundStyle as React.CSSProperties}
            ></ToggleButton>
            </Tooltip>
            }
        </>
    );
};

export default ChoiceOptionsButton;