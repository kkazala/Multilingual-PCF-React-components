import { tokens } from '@fluentui/react-components';
import * as Color from 'color';

export const requiredLevelsEnum = {
    None: 0,
    Recommended: 3,
    Required: 2
};
export type parsedResult = {
    value: object | undefined;
    isJson: boolean;
}

export class Utils {

    //#region private functions
    private static replaceNewlinesWithinQuotes = (input: string): string => {
        return input.replace(/("[^"]*")/g, (_, quotedString) => {
            return quotedString.replace(/\n/g, '\\n');
        });
    }
    //#endregion

    public static TryParseJson = (jsonString: string): parsedResult => {
        try {
            const o = JSON.parse(Utils.replaceNewlinesWithinQuotes(jsonString));

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
            value: undefined,
            isJson: false
        };

    }
    public static GetValueLocalized = (textValue: string, lcid: string): string => {

        const tryParseJson = (jsonString: string): string | object => {
            try {
                const o = JSON.parse(Utils.replaceNewlinesWithinQuotes(jsonString));

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
    public static IsHtml = (textValue: string): boolean => {
        return /<[a-z][\s\S]*>/i.test(textValue);
    }
    public static GetContrastingColor = (colorRGBA: string) => {
        const color = Color(colorRGBA);
        if (color.isLight()) {
            return tokens.colorNeutralForeground2
        }
        else if (color.isDark()) {
            return tokens.colorNeutralBackground2
        }
    }
}