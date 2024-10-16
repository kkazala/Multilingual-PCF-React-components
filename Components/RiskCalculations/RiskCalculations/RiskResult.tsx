import { makeStyles, Text, tokens, Tooltip } from "@fluentui/react-components";
import { CircleFilled, FireFilled, ShieldFilled, ShieldQuestionRegular, SquareFilled } from "@fluentui/react-icons";
import React from "react";
import { Required } from "../../_Utils";

export type RiskResultProps = {
    riskIcon: string;
    riskLabel: string;
    riskDescription: string;
    riskColor: string | undefined;
    required:number;
}

const useStyles = makeStyles({
    riskIcon: {
        fontSize: "32px",
        alignSelf: 'center'
    },
    riskIconUnknown: {
        fontSize: "32px",
        alignSelf: 'center',
        color: tokens.colorNeutralForeground4
    }
});

const RiskResult = (props: RiskResultProps): JSX.Element => {
    const { riskIcon, riskLabel, riskColor, riskDescription } = props;
    const styles = useStyles();

    const iconColorStyle = React.useMemo(() => ({
        ['color']: riskColor ?? tokens.colorNeutralForeground4,
    }), [riskColor])

    const renderIcon = (riskIcon: string) => {
        switch (riskIcon) {
            case "0":
                return <SquareFilled className={styles.riskIcon} style={iconColorStyle as React.CSSProperties} />
            case "1":
                return <CircleFilled className={styles.riskIcon} style={iconColorStyle as React.CSSProperties} />
            case "2":
                return <FireFilled className={styles.riskIcon} style={iconColorStyle as React.CSSProperties} />
            case "3":
                return <ShieldFilled className={styles.riskIcon} style={iconColorStyle as React.CSSProperties} />
            default:
                return <ShieldQuestionRegular className={styles.riskIconUnknown} />;
        }
    }

    return <>
        <div role="presentation" style={{ display: "table-cell" }}>
        <Text >{riskLabel}</Text>
        <Required required={props.required} />
        </div>
        <Tooltip content={riskDescription} relationship="description">
            <div>{renderIcon(riskIcon)}</div>
        </Tooltip>
    </>;
}
export default RiskResult;