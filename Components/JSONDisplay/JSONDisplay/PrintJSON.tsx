﻿import { Divider, FluentProvider, IdPrefixProvider, makeStyles, Tree, TreeItem, TreeItemLayout, webLightTheme } from "@fluentui/react-components";
import {
    CircleSmall20Filled
} from "@fluentui/react-icons";
import * as React from 'react';
import { parsedResult, Utils } from "../../_Utils";

export interface IPrintJSONProps {
    jsonVal: string;
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

    React.useEffect(() => {

        const getAsJSON = (val: string): parsedResult => {
            if (val === undefined || val === null || val === "") return { value: undefined, isJson: false };
            return Utils.TryParseJson(val);
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