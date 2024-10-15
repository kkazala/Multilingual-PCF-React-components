import * as React from 'react';
import { useState } from 'react';

export const requiredLevelsEnum = {
    None: 0,
    Recommended: 3,
    Required: 2
};
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
    const [htmlRequired, setHtmlRequired] = useState<JSX.Element>();
    const [textCSS, setTextCSS] = useState<object>({});

    const getValueLocalized = (textValue: string, lcid: string): string => {

        const replaceNewlinesWithinQuotes = (input: string): string => {
            return input.replace(/("[^"]*")/g, (match, quotedString) => {
                return quotedString.replace(/\n/g, '\\n');
            });
        }
        const tryParseJson = (jsonString: string): string | object => {
            try {
                const o = JSON.parse(replaceNewlinesWithinQuotes(jsonString));

                // Handle non-exception-throwing cases:
                // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
                // but... JSON.parse(null) returns 'null', and typeof null === "object",
                // so we must check for that, too.
                if (o && typeof o === "object" && o !== null) {
                    return o;
                }
            } catch (e) {
                //this is very much expected because the text parameter doesn't have to be a JSON string
                //console.log(e);
            }
            return jsonString;
        }

        const parsedResult = tryParseJson(textValue);
        if (typeof parsedResult === "object") {
            if (Object.keys(parsedResult).includes(lcid)) {
                return parsedResult[lcid as keyof typeof parsedResult];
            }
            else if (Object.keys(parsedResult).includes("default")) {
                return parsedResult["default" as keyof typeof parsedResult];
            }
        }
        return textValue;
    }
    const isHtml = (textValue: string): boolean => {
        return /<[a-z][\s\S]*>/i.test(textValue);
    }
    const parseHTML = (html: string): JSX.Element => {
        return <div dangerouslySetInnerHTML={{
            __html: html    // this is the line that renders the HTML
        }}></div>;
    }

    React.useEffect(() => {
        if (props.required === requiredLevelsEnum.Required) {
            //add , font-weight:400 to the style to make it normal

            setHtmlRequired(<span style={{ color: 'rgb(188, 47, 50)', fontWeight: 400}}>*</span>);
        }
        else if (props.required === requiredLevelsEnum.Recommended) {
            setHtmlRequired(<span id="id-required-icon" aria-hidden="true" style={{ color: 'rgb(15, 108, 189)', fontWeight: 400 }}>⁺</span>);
        }
        else {
            setHtmlRequired(<></>);
        }
    },[props.required]);

    React.useEffect(() => {
        const setHTML = (html: string, lcid:string) => {
            if(html === undefined || html === null || html==="") return;
            const txtVal = getValueLocalized(html, lcid);
            if (isHtml(txtVal)) {
                setHtmlValue(parseHTML(txtVal));
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

    return (<>
        {!props.masked && <span style={textCSS}>
            {htmlValue} {htmlRequired}
        </span>
        }
    </>
    );
}

export default LocalizedText;