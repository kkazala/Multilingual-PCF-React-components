import { DefaultButton, IButtonStyles } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import * as React from 'react';


export interface IButtonToggleProps {
    item: ComponentFramework.PropertyHelper.OptionMetadata
    icon:string
    disabled?: boolean;
    checked?: boolean;
    onChange: (newValue: number | undefined) => void;
}
const iconStyles = { marginRight: '8px' };

type btnProperties = {
    text: string;
    onClick: () => void;
    iconProps?: { iconName: string };
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
        btnProps.iconProps = { iconName: icon };
    }
    const style: Partial<IButtonStyles > = {
        rootChecked: {
            backgroundColor: muted || checked
                ? item.Color ?? 'primary'
                : 'default',
            color: muted || checked ? 'white' : 'rgb(36, 36, 36)',
        },
    };

    return (
        <>
            <DefaultButton
                styles={style}
                toggle
                checked={muted || checked}
                allowDisabledFocus
                disabled={disabled}
                {...btnProps}
            />
        </>
    );
};

export default ButtonToggle;