﻿import * as React from 'react';
import { useState } from 'react';

export interface ILocalizedTextProps {
    textValue: string;
    textCSS: string;
    lcid: string;
    disabled: boolean;
    masked: boolean;
}
type parsedResult = {
    value: string | object;
    isJson: boolean;
}

const LocalizedText = (props: ILocalizedTextProps) => {
    const [htmlValue, setHtmlValue] = useState<JSX.Element>();
    const [textCSS, setTextCSS] = useState<object>({});

    const replaceNewlinesWithinQuotes=(input: string): string =>{
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
    const isHtml = (textValue: string): boolean => {
        return /<[a-z][\s\S]*>/i.test(textValue);
    }
    const parseHTML = (html: string): JSX.Element => {
        return <div dangerouslySetInnerHTML={{
            __html: html    // this is the line that renders the HTML
        }}></div>;
    }

    React.useEffect(() => {
        const setHTML = (html: string) => {
            if(html === undefined || html === null || html==="") return;
            const txtVal = getValueLocalized(html);
            if (isHtml(txtVal)) {
                setHtmlValue(parseHTML(txtVal));
            }
            else {
                setHtmlValue(<>{txtVal}</>);
            }
        }
        setHTML(props.textValue);

    }, [props.textValue]);

    React.useEffect(() => {
        if (props.textCSS) {
            const style = Object.fromEntries(props.textCSS.split(';').map(s => s.split(':').map(s => s.trim())));
            setTextCSS(style);
        }
    }, [props.textCSS]);

    return (<>
        {!props.masked && <span style={textCSS}>
            {htmlValue}
        </span>
        }
    </>
    );
}

export default LocalizedText;