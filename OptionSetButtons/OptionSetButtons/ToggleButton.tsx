import { Icon } from '@fluentui/react';
import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
import { useBoolean } from '@fluentui/react-hooks';
import * as React from 'react';


export interface IButtonToggleProps {
    item: ComponentFramework.PropertyHelper.OptionMetadata
    icon:string
    disabled?: boolean;
    checked?: boolean;
    onChange: (newValue: number | undefined) => void;
}


type btnProperties = {
    text: string;
    onClick: () => void;
    icon?: React.ReactElement;
}

const ButtonToggle=(props:IButtonToggleProps) => {
    const { disabled, checked, item, icon } = props;
    const [muted, { toggle: setMuted }] = useBoolean(false);

    const btnProps: btnProperties = {
        text: item.Label,
        onClick: () => {
            setMuted;
            props.onChange(item.Value)
        }
    };
    if (icon) {
        //add iconProps to btnProps
        btnProps.icon = <Icon iconName={icon} />;
    }
    const useStyles = makeStyles({
        rootChecked: {
            backgroundColor: muted || checked
                ? item.Color ?? tokens.colorBrandBackground
                : 'default',
            color: muted || checked ? 'white' : 'rgb(36, 36, 36)',
        },
    });

    const styles = useStyles();

    return (
        <>
            <ToggleButton className={styles.rootChecked}
                checked={muted || checked}
                appearance={checked ? "primary":"outline"}
                disabledFocusable
                disabled={disabled}
                {...btnProps}
            >{btnProps.text}</ToggleButton>
        </>
    );
};

export default ButtonToggle;