﻿import { FluentProvider, IdPrefixProvider, makeStyles, webLightTheme } from '@fluentui/react-components';
import * as React from 'react';
import { useState } from 'react';
import ButtonToggle from './ToggleButton';

export interface IChoicesButtonsProps {
    label: string;
    value: number | null;
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    onChange: (newValue: number | undefined) => void;
    disabled: boolean;
    masked: boolean;
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: 'auto',
        height: 'auto',
        boxSizing: 'border-box',
        '> *': {
            textOverflow: 'ellipsis',
        },
        '> :not(:first-child)': {
            marginTop: '0px',
            marginLeft: '10px',
        },
        '> *:not(.ms-StackItem)': {
            flexShrink: 1,
        },
    },
})

const ChoicesButtons = (props: IChoicesButtonsProps) => {

    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [buttons,setButtons] = useState<JSX.Element[]>([]);
    const styles = useStyles();

    React.useEffect(() => {

        const getButtons = (options: ComponentFramework.PropertyHelper.OptionMetadata[], value: number | null) => {
            return options.map((item) => {
                return (
                    <ButtonToggle
                        key={`${Date.now() }${item.Value}`}
                        item={item}
                        checked={item.Value === value}
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
            const _buttons = getButtons(props.options, props.value );

            setButtons(_buttons);
        }
    }, [props.options, props.value, props.disabled, props.masked]);


    return (<IdPrefixProvider value="PCF-OptionSetButtons">
        <FluentProvider theme={webLightTheme}>
        {selectedLabel && <div>{selectedLabel}</div>}
        {buttons && buttons.length > 0 &&
            <div className={styles.root}>
                {buttons}
            </div >
        }
        </FluentProvider>
    </IdPrefixProvider >);
}

export default ChoicesButtons;