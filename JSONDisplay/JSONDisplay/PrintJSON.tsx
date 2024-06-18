import { IStackStyles, IStackTokens, ITheme, Separator, Stack, createTheme } from '@fluentui/react';
import * as React from 'react';

export interface IPrintJSONProps {
    jsonVal: string;
}
type parsedResult = {
    value:  object | undefined;
    isJson: boolean;
}
type sectionInfo = {
    name: string;
    controls: Array<string>;
};
type tabInfo = {
    name: string;
    sections: Array<sectionInfo>;
};
const stackStyle: IStackStyles = {
    root: {
        textAlign: 'left',
        fontSize:'small',
    },
};
const itemStyle: IStackStyles = {
    root: {
        paddingLeft: '20px',
        fontColor:'rgb(102, 102, 102)'
    },
};
const themeSeparator: ITheme = createTheme({
    fonts: {
        medium: {
            fontWeight: 'bold',
        },
    },
    palette: {
        neutralLighter:'#a19f9d'
    }
});

const containerStackTokens: IStackTokens = { childrenGap: 5 };

const PrintJSON = (props: IPrintJSONProps) => {

    const [results, setResults] = React.useState<tabInfo []|null>(null);

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
            value: undefined,
            isJson: false
        };

    }

    React.useEffect(() => {

        const getAsJSON=(val:string):parsedResult=>{
            if (val === undefined || val === null || val === "") return { value: undefined, isJson: false };
            return tryParseJson(val);
        }
        const res= getAsJSON(props.jsonVal);
        if(res.isJson && res.value !== undefined){
            const validationInfo: tabInfo[] = res.value as tabInfo[];

            const clean=validationInfo.map((tab)=>{
                const sections=tab.sections.map((section)=>{
                    const controls=section.controls.map((control)=>{
                        return control;
                    }).filter((control)=>control!==undefined);
                    return {...section, controls:controls};
                }).filter((section)=>section!==undefined);
                return {...tab, sections:sections};
            });
            setResults(clean);
        }

    }, [props.jsonVal]);

    return (<Stack styles={stackStyle} tokens={{childrenGap:10}}>
        {
            //print tab names
            results !== undefined && results !== null && Object.keys(results).length > 0 &&
            results.map((tab, tabIndex) => {
                return (
                    <>
                        <Separator alignContent="start" theme={themeSeparator} >{tab.name}</Separator>
                        <Stack key={tabIndex} tokens={containerStackTokens} styles={itemStyle}>
                        {
                            //print section names
                            tab.sections.map((section) => {
                                return (<>
                                        <Stack.Item>{section.name}</Stack.Item>
                                        {
                                            //print control names
                                            section.controls.map((c, controlIndex) => {
                                                return (
                                                    <Stack.Item key={controlIndex} styles={itemStyle}>
                                                        <span>{c}</span>
                                                    </Stack.Item>
                                                )
                                            })
                                        }
                                </>
                                )
                            })
                        }
                    </Stack>
                    </>
                )
            })

        }
    </Stack>)
}

export default PrintJSON;