import { Divider, FluentProvider, IdPrefixProvider, Tree, TreeItem, TreeItemLayout, makeStyles, webLightTheme } from "@fluentui/react-components";
import {
    CircleSmall20Filled
} from "@fluentui/react-icons";
import * as React from 'react';

export interface IPrintJSONProps {
    jsonVal: string;
}
type parsedResult = {
    value: object | undefined;
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
const useStyles = makeStyles({
    customFont: {
        fontSize: "14px",
        fontWeight: "bold",
    },
    treeItemWide: {
        width: '100%',
        '> :nth-child(2)': {
            width: '100%',
        },
    },
});
const PrintJSON = (props: IPrintJSONProps) => {
    const styles = useStyles();
    const [results, setResults] = React.useState<tabInfo[] | null>(null);

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

        const getAsJSON = (val: string): parsedResult => {
            if (val === undefined || val === null || val === "") return { value: undefined, isJson: false };
            return tryParseJson(val);
        }
        const res = getAsJSON(props.jsonVal);
        if (res.isJson && res.value !== undefined) {
            const validationInfo: tabInfo[] = res.value as tabInfo[];

            const clean = validationInfo.map((tab) => {
                const sections = tab.sections.map((section) => {
                    const controls = section.controls.map((control) => {
                        return control;
                    }).filter((control) => control !== undefined);
                    return { ...section, controls: controls };
                }).filter((section) => section !== undefined);
                return { ...tab, sections: sections };
            });
            setResults(clean);
        }

    }, [props.jsonVal]);

    return (<IdPrefixProvider value="PCF-PrintJSON">
        <FluentProvider theme={webLightTheme}>
            <Tree >
                {
                    //print tab names
                    results !== undefined && results !== null && Object.keys(results).length > 0 &&
                    results.map((tab, tabIndex) => {
                        return (
                            <>
                                <TreeItem  open={true}  itemType="branch" value={`default-tree-${tabIndex}`}>
                                    <TreeItemLayout className={styles.treeItemWide}  expandIcon={<></>}>
                                        <Divider alignContent="start" className={styles.customFont} appearance="strong">{tab.name}</Divider>
                                    </TreeItemLayout>
                                    <Tree>
                                        {
                                            //print section names
                                            tab.sections.map((section, sectionIndex) => {
                                                return (<TreeItem open={true}  key={tabIndex} itemType="branch" value={`default-subtree-${sectionIndex}`}>
                                                    <TreeItemLayout expandIcon={<CircleSmall20Filled />}>{section.name}</TreeItemLayout>
                                                    <Tree>
                                                        {
                                                            //print control names
                                                            section.controls.map((c, controlIndex) => {
                                                                return (
                                                                    <TreeItem key={controlIndex} itemType="leaf" value={`default-leaf-${controlIndex}`}>
                                                                        <TreeItemLayout>{c}</TreeItemLayout>
                                                                    </TreeItem>
                                                                )
                                                            })
                                                        }
                                                    </Tree>
                                                </TreeItem>
                                                )
                                            })
                                        }
                                    </Tree >
                                </TreeItem>
                            </>
                        )
                    })

                }
            </Tree >
        </FluentProvider>
    </IdPrefixProvider >)
}

export default PrintJSON;