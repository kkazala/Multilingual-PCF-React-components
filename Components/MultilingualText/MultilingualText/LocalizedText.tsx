import * as React from 'react';
import { useState } from 'react';
import { ParsedHTML, Required, Utils } from "../../_Utils";


export interface ILocalizedTextProps {
    textValue: string;
    textCSS: string;
    lcid: string;
    disabled: boolean;
    masked: boolean;
    required: number;
}

const LocalizedText = (props: ILocalizedTextProps) => {
    const [htmlValue, setHtmlValue] = useState<JSX.Element>();
    const [textCSS, setTextCSS] = useState<object>({});

    React.useEffect(() => {
        const setHTML = (html: string, lcid:string) => {
            if(html === undefined || html === null || html==="") return;
            const txtVal = Utils.GetValueLocalized(html, lcid);
            if (Utils.IsHtml(txtVal)) {
                setHtmlValue(ParsedHTML(txtVal));
            }
            else {
                setHtmlValue(<>{txtVal}</>);
            }
        }
        setHTML(props.textValue, props.lcid);

    }, [props.textValue]);

    React.useEffect(() => {
        if (props.textCSS) {
            const style = Object.fromEntries(props.textCSS.split(';').map(s => s.split(':').map(s => s.trim())));
            setTextCSS(style);
        }
    }, [props.textCSS]);

    return (<div style={{ display: "flex" }}>
        {!props.masked && <span style={textCSS}>
            {htmlValue}
            <Required required={props.required} />
        </span>
        }
    </div>
    );
}

export default LocalizedText;