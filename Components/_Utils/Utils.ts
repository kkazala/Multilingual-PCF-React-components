export const requiredLevelsEnum = {
    None: 0,
    Recommended: 3,
    Required: 2
};

export class Utils {
    public static getValueLocalized = (textValue: string, lcid: string): string => {

        const replaceNewlinesWithinQuotes = (input: string): string => {
            return input.replace(/("[^"]*")/g, (_, quotedString) => {
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
    public static isHtml = (textValue: string): boolean => {
        return /<[a-z][\s\S]*>/i.test(textValue);
    }
}