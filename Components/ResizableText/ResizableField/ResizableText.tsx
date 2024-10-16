import { FluentProvider, IdPrefixProvider, makeStyles, Textarea, webLightTheme } from '@fluentui/react-components';
import * as React from "react";
import { Utils } from "../../_Utils";

export type ResizableTextProps = {
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

const ResizableText = (props: ResizableTextProps): JSX.Element => {
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

    return (<IdPrefixProvider value="PCF-ResizableTextArea" >
        <FluentProvider theme={webLightTheme} className={styles.container} >
                <Textarea
                resize={getResizeChoice(resizeChoice)}
                placeholder={Utils.GetValueLocalized(placeHolderText, lcid)}
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

export default ResizableText;