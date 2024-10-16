import { FluentProvider, IdPrefixProvider, Switch, SwitchOnChangeData, webLightTheme } from "@fluentui/react-components";
import * as React from 'react';
import { ParsedHTML, Required, Utils } from "../../_Utils";

export interface IDateToggleProps {
    label: string;
    value: Date | null;
    onChange: (newValue: boolean | undefined) => void;
    disabled: boolean;
    lcid: string;
    masked: boolean;
    required: number;
}

const DateToggle = (props: IDateToggleProps) => {
    const [htmlValue, setHtmlValue] = React.useState<JSX.Element>();
    const defaultChecked = props.value !== undefined && props.value !== null;

    React.useEffect(() => {
        const setHTML = (html: string, lcid: string) => {
            if (html === undefined || html === null || html === "") return;
            const txtVal = Utils.getValueLocalized(html, lcid);
            if (Utils.isHtml(txtVal)) {
                setHtmlValue(ParsedHTML(txtVal));
            }
            else {
                setHtmlValue(<>{txtVal}</>);
            }
        }
        setHTML(props.label, props.lcid);

    }, []);

    function _onChange(ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) {
        props.onChange(ev.currentTarget.checked);
    }

    return (<>
        {!props.masked &&
            <IdPrefixProvider value="PCF-DateToggle">
                <FluentProvider theme={webLightTheme}>
                    <Switch
                        label={{
                            children: () => (
                                <div role="presentation" style={{ display: "flex", margin: "auto" }}>
                                    {htmlValue}
                                    <Required required={props.required} />
                                </div>
                            ),
                        }}
                        onChange={_onChange}
                        disabled={props.disabled}
                        checked={defaultChecked}
                        defaultChecked={defaultChecked} />

                </FluentProvider>
            </IdPrefixProvider >

        }
    </>)
}

export default DateToggle;