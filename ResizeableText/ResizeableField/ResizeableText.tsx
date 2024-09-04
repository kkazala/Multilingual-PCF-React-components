import { FluentProvider, IdPrefixProvider, makeStyles, Textarea, webLightTheme } from '@fluentui/react-components';
import * as React from "react";

export type ResizeableTextProps = {
    textValue: string;
    placeHolderText: string;
    sizeChoice: string;
    disabled: boolean;
    masked: boolean;
    lcid: string;
    onChange: (newValue: string) => void;

}
const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    textarea0: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '80px !important',
        }
    },
    textarea1: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '100px !important',
        }
    }, textarea2: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '200px !important',
        }
    }, textarea3: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '300px !important',
        }
    }, textarea4: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '450px !important',
        }
    }, textarea5: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '550px !important',
        }
    }, textarea6: {//span
        width: '100%',
        '> *': { //textarea
            maxHeight: '650px !important',
            minHeight: '650px !important',
        }
    },

});

const ResizeableText = (props: ResizeableTextProps): JSX.Element => {
    const styles = useStyles();
    const { textValue, placeHolderText, sizeChoice,disabled, masked, lcid, onChange } = props;
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
        if (typeof parsedResult === "object" &&
            Object.keys(parsedResult).includes(lcid)) {
            return parsedResult[lcid as keyof typeof parsedResult];
        }
        return textValue;
    }
    const getClassName = (sizeChoice: string): string => {
        switch (sizeChoice) {
            case "0":
                return styles.textarea0;
            case "1":
                return styles.textarea1;
            case "2":
                return styles.textarea2;
            case "3":
                return styles.textarea3;
            case "4":
                return styles.textarea4;
            case "5":
                return styles.textarea5;
            case "6":
                return styles.textarea6;
            default:
                return styles.textarea0;
        }
    }


    return (<IdPrefixProvider value="IDAPPS-ResizeableTextArea" >
        <FluentProvider theme={webLightTheme} className={styles.container} >
            <Textarea
                resize="vertical"
                placeholder={getValueLocalized(placeHolderText, lcid)}
                defaultValue={masked? "***":textValue}
                onChange={(_, data) => onChange(data?.value ?? "")}
                className={getClassName(sizeChoice)}
                disabled={disabled}
            />

        </FluentProvider>
    </IdPrefixProvider >
    );
}

export default ResizeableText;