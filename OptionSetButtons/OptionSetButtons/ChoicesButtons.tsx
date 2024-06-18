import { Stack } from '@fluentui/react';
import * as React from 'react';
import { useState } from 'react';
import ButtonToggle from './ToggleButton';

export interface IChoicesButtonsProps {
    label: string;
    value: number | null;
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    configuration: string | null;
    onChange: (newValue: number | undefined) => void;
    disabled: boolean;
    masked: boolean;
}


const ChoicesButtons = (props: IChoicesButtonsProps) => {

    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(props.disabled);
    const [masked, setMasked] = useState<boolean>(props.masked);
    const [error, setError] = useState<string | undefined>();

    const [buttons,setButtons] = useState<JSX.Element[]>([]);

    React.useEffect(() => {

        const getIconMapping = (iconMapJSON: string): Record<number, string> => {
            let iconMap: Record<number, string> = {};
            if(iconMapJSON!==""){
                try{
                    iconMap = JSON.parse(iconMapJSON);
                }
                catch(e){
                    setError(`Invalid configuration`);
                }
            }
            return iconMap;
        }
        const getButtons = (options: ComponentFramework.PropertyHelper.OptionMetadata[], value: number | null,iconMapping: Record<number, string>) => {
            return options.map((item) => {
                return (
                    <ButtonToggle
                        key={item.Value}
                        item={item}
                        icon={iconMapping[item.Value]}
                        disabled={disabled}
                        checked={item.Value == value}
                        onChange={props.onChange}
                    />
                );
            })
        }

        if(props.masked){
            return;
        }

        if(props.disabled){
            const currentValue=props.options.filter((item) => item.Value === props.value).map((item) => item.Label)[0];
            setSelectedLabel(currentValue);

        }else{
            const iconMapping = getIconMapping(props.configuration ?? '');
            const _buttons = getButtons(props.options, props.value, iconMapping);

            setButtons(_buttons);
        }
    }, [props.options, props.configuration, props.value, props.disabled, props.masked]);


    React.useEffect(() => {
        setDisabled(props.disabled);
    },[props.disabled]);

    React.useEffect(() => {
        setMasked(props.masked);
    },[props.masked]);

    return (<>
        {selectedLabel && <div>{selectedLabel}</div>}
        {buttons && buttons.length > 0 &&
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                {buttons}
            </Stack>
        }
    </>);
}

export default ChoicesButtons;