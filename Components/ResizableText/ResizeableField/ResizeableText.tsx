import { FluentProvider, IdPrefixProvider, makeStyles, Textarea, webLightTheme } from '@fluentui/react-components';
import * as React from "react";

export type ResizeableTextProps = {
    textValue: string;
    placeHolderText: string;
    resizeChoice: string;
    height: number;
    maxHeight: number;
    disabled: boolean;
    masked: boolean;
    lcid: string;
    onChange: (newValue: string) => void;

}

type ResizeChoices = "none" | "vertical";


const useStyles = makeStyles({
    container: {
        width: '100%',
    }
});

const ResizeableText = (props: ResizeableTextProps): JSX.Element => {
    const styles = useStyles();
    const { textValue, placeHolderText, disabled, masked, lcid, height, maxHeight, resizeChoice, onChange } = props;

    const textAreaHeightStyle = React.useMemo(() => ({
        ['minHeight']: `${height}px`,
        ["maxHeight"]: `${maxHeight}px`
    }), [height, maxHeight])

    const getResizeChoice = (resizeChoice: string): ResizeChoices => {
        switch (resizeChoice) {
            case "0":
                return "none";
            case "1":
                return "vertical";
            default:
                return "none";
        }
    }

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

    return (<IdPrefixProvider value="PCF-ResizeableTextArea" >
        <FluentProvider theme={webLightTheme} className={styles.container} >
                <Textarea
                resize={getResizeChoice(resizeChoice)}
                    placeholder={getValueLocalized(placeHolderText, lcid)}
                    defaultValue={masked? "***":textValue}
                    onChange={(_, data) => onChange(data?.value ?? "")}
                    className={styles.container}
                    textarea={{ style: textAreaHeightStyle }}
                    disabled={disabled}
                />
        </FluentProvider>
    </IdPrefixProvider >
    );
}

export default ResizeableText;