import { FluentProvider, IdPrefixProvider, Switch, SwitchOnChangeData, webLightTheme } from "@fluentui/react-components";
import * as React from 'react';


export interface IDateToggleProps{
    label: string;
    value: Date | null;
    onChange: (newValue: boolean | undefined) => void;
    disabled: boolean;
    masked: boolean;
}

const DateToggle = (props: IDateToggleProps) => {

    const defaultChecked = props.value!==undefined && props.value!==null;

    function _onChange(ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) {
        props.onChange(ev.currentTarget.checked);
    }

    return(<>
        {!props.masked &&
            <IdPrefixProvider value="APPID-">
                <FluentProvider theme={webLightTheme}>
                    <Switch
                        label={props.label}
                        onChange={_onChange}
                        disabled={props.disabled}
                        checked={defaultChecked}
                        defaultChecked={defaultChecked}/>
                </FluentProvider>
            </IdPrefixProvider >

        }
    </>)
}

export default DateToggle;