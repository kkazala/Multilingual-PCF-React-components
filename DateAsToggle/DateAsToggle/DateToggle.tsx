import { FluentProvider, IdPrefixProvider, Switch, SwitchOnChangeData, webLightTheme } from "@fluentui/react-components";
import * as React from 'react';


export interface IDateToggleProps{
    label: string;
    value: Date | null;
    onChange: (newValue: boolean | undefined) => void;
    disabled: boolean;
    lcid: string;
    masked: boolean;
}
type parsedResult = {
    value: string | object;
    isJson: boolean;
}

const DateToggle = (props: IDateToggleProps) => {

    const defaultChecked = props.value!==undefined && props.value!==null;
    const replaceNewlinesWithinQuotes = (input: string): string => {
        return input.replace(/("[^"]*")/g, (match, quotedString) => {
            return quotedString.replace(/\n/g, '\\n');
        });
    }
    const tryParseJson = (jsonString: string): parsedResult => {
        try {
            const o = JSON.parse(replaceNewlinesWithinQuotes(jsonString));

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns 'null', and typeof null === "object",
            // so we must check for that, too.
            if (o && typeof o === "object" && o !== null) {
                return {
                    value: o,
                    isJson: true
                }
            }
        } catch (e) {
            //this is very much expected because the text parameter doesn't have to be a JSON string
            //console.log(e);
        }

        return {
            value: jsonString,
            isJson: false
        };

    }

    const getValueLocalized = (textValue: string): string => {
        const parsedResult = tryParseJson(textValue);
        if (parsedResult.isJson &&
            Object.keys(parsedResult.value).includes(props.lcid)) {
            return parsedResult.value[props.lcid as keyof typeof parsedResult.value];
        }
        return textValue;
    }

    function _onChange(ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) {
        props.onChange(ev.currentTarget.checked);
    }

    return(<>
        {!props.masked &&
            <IdPrefixProvider value="IDAPPS-DateToggle">
                <FluentProvider theme={webLightTheme}>
                    <Switch
                        label={getValueLocalized(props.label)}
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