import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
// import * as AllIcons from '@fluentui/react-icons';
// import { FluentIcon } from '@fluentui/react-icons';
import * as React from 'react';

export interface IButtonToggleProps {
    item: ComponentFramework.PropertyHelper.OptionMetadata
    icon:string;
    checked?: boolean;
    onChange: (newValue: number | undefined) => void;
}

type btnProperties = {
    text: string;
    onClick: () => void;
    icon?: JSX.Element;
}

const ButtonToggle=(props:IButtonToggleProps) => {
    const {item, icon } = props;
    const [checked, setChecked] = React.useState<boolean>(props.checked ?? false);

    const toggleChecked = React.useCallback(
        (buttonIndex: number) => {
            setChecked;
            props.onChange(buttonIndex)
            console.log("Button Index: ", buttonIndex);
        },
        [checked]
    );

    const btnProps: btnProperties = {
        text: item.Label,
        onClick: () => toggleChecked(item.Value)
    };
    // if (icon) {
    //     const BtnIcon: FluentIcon = AllIcons[icon as keyof typeof AllIcons] as FluentIcon;
    //     btnProps.icon = <BtnIcon />;
    // }
    const useStyles = makeStyles({
        checked:{
            backgroundColor: item.Color ?? tokens.colorBrandBackground,
            color: tokens.colorNeutralForegroundOnBrand,
        },
        default:{
            backgroundColor: tokens.colorNeutralBackground1,
            color: tokens.colorNeutralForeground1,
        },

    });

    const styles = useStyles();

    return (
        <>
            <ToggleButton className={checked? styles.checked:styles.default}
                checked={checked}
                appearance={checked ? "primary":"outline"}
                {...btnProps}
            >{btnProps.text}</ToggleButton>
        </>
    );
};

export default ButtonToggle;