import { FluentProvider, IdPrefixProvider, makeStyles, Textarea, webLightTheme } from '@fluentui/react-components';
import * as React from "react";
import { useRef } from 'react';
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
    name: string;
}

type ResizeChoices = "none" | "vertical";

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    span: {
        width: '100%',
        border: '1px solid #ccc'
    }
});

const ResizableText = (props: ResizableTextProps): JSX.Element => {
    const styles = useStyles();
    const inputReference = useRef<HTMLTextAreaElement | null>(null);
    const { textValue, placeHolderText, disabled, masked, lcid, height, maxHeight, resizeChoice, onChange } = props;
    let key: string = new Date().getTime().toString();

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

    React.useEffect(() => {
        // console.log(`rendering control ${props.name} with value: ${textValue}`);
        key = new Date().getTime().toString();
    }, [textValue]);

    // inform PCF component about value change AFTER the focus out
    // this ensures the control doesn't lose focus "randomly" and is aligned with how the out-of-the-box control works
    const onFocusOut = (_: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(inputReference?.current?.value ?? "");
    }

    return (<IdPrefixProvider value="PCF-ResizableTextArea" >
        <FluentProvider theme={webLightTheme} className={styles.container} >
            <Textarea
                key={key}
                ref={inputReference}
                resize={getResizeChoice(resizeChoice)}
                placeholder={Utils.GetValueLocalized(placeHolderText, lcid)}
                defaultValue={masked ? "***" : textValue}
                onBlur={onFocusOut}
                className={styles.span}
                textarea={{ style: textAreaHeightStyle }}
                disabled={disabled}
            />
        </FluentProvider>
    </IdPrefixProvider >
    );
}

export default ResizableText;