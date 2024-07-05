﻿import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
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

const ButtonToggle = (props: IButtonToggleProps) => {
    const [checked, setChecked] = React.useState<boolean>(false);
    const [btnProps, setBtnProps] = React.useState<btnProperties>();

    const toggleChecked = (buttonIndex: number) => {
        setChecked;
        props.onChange(buttonIndex)
    };
    const useStyles = makeStyles({
        checked: {
            backgroundColor: props.item.Color ?? tokens.colorBrandBackground,
            color: tokens.colorNeutralForegroundOnBrand,
        },
        default: {
            backgroundColor: tokens.colorNeutralBackground1,
            color: tokens.colorNeutralForeground1,
        },

    });
    const styles = useStyles();


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
            >{btnProps.text}</ToggleButton>
            }
        </>
    );
};

export default ButtonToggle;