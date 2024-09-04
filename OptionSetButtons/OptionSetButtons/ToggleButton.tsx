import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
import * as Color from 'color';
// import * as AllIcons from '@fluentui/react-icons';
// import { FluentIcon } from '@fluentui/react-icons';
import * as React from 'react';

export interface IButtonToggleProps {
    item: ComponentFramework.PropertyHelper.OptionMetadata
    icon: string;
    checked?: boolean;
    onChange: (newValue: number | undefined) => void;
}

type btnProperties = {
    text: string;
    onClick: () => void;
    className:string;
    appearance:  "primary" | "outline" | "subtle" | "transparent" | undefined;
    icon?: JSX.Element;
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
const getContrastingColor = (colorRGBA: string) => {
    const color = Color(colorRGBA);
    //for background white
    if (color.isLight()) {
        return tokens.colorNeutralForegroundOnBrand;
    }
    else if (color.isDark() && color.alpha() < 0.5) {
        return tokens.colorNeutralForegroundOnBrand;
    }
    else {
        return tokens.colorNeutralForegroundOnBrand;
    }
}

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
        ["color"]: getContrastingColor(props.item.Color),
    }), [props.item.Color])

    // if (icon) {
    //     const BtnIcon: FluentIcon = AllIcons[icon as keyof typeof AllIcons] as FluentIcon;
    //     btnProps.icon = <BtnIcon />;
    // }

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