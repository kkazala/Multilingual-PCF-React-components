import { GaugeChart, IGaugeChartSegment } from "@fluentui/react-charting";
import { FluentProvider, IdPrefixProvider, makeStyles, Text, tokens, webLightTheme } from "@fluentui/react-components";
import * as React from "react";
import ButtonToggle from "./ToggleButton";

export type CalculateRiskProps = {
    impactLabel:string;
    impactOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
    impactValue: number;
    impactProps: ControlProps;
    probabilityLabel:string;
    probabilityOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
    probabilityValue: number;
    probabilityProps: ControlProps;
    riskOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
    riskValue: number;
    riskProps: ControlProps;
    riskDefinition: string;
    onChange: (newImpact: number, newProbability: number, newRisk: number) => void;
}
export type ControlProps = {
    disabled: boolean;
    masked: boolean;
}
export type RiskDefinition = {
    [key: string]: {
        impact: number;
        probability: number;
    }[]
}

const useStyles = makeStyles({
    container:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.colorBrandBackground2,
        '> :not(:first-child)': {
            marginTop: '0px',
            marginLeft: '15px',
        },
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: 'auto',
        boxSizing: 'border-box',
        '> *': {
            textOverflow: 'ellipsis',
        },
        '> :not(:first-child)': {
            marginTop: '0px',
            marginLeft: '5px',
        },
        '> *:not(.ms-StackItem)': {
            flexShrink: 1,
        },
    }
});
const CalculateRisk = (props: CalculateRiskProps) => {
    const { impactOptions, probabilityOptions, riskOptions, impactLabel,probabilityLabel } = props;
    const segmentSize = (10 / riskOptions.length);
    const styles = useStyles();
    const [impactVal, setImpactVal] = React.useState<number>(props.impactValue);
    const [probabilityVal, setProbabilityVal] = React.useState<number>(props.probabilityValue);
    const [riskVal, setRiskVal] = React.useState<number>(props.riskValue);
    const [gaugeSegments,setGaugeSegments] = React.useState<IGaugeChartSegment[]>([]);
    const [gaugeValue, setGaugeValue] = React.useState<number>(0);

    const [errMsg, setErrMsg] = React.useState<string>("");
    const [impactBtns, setImpactBtns] = React.useState<JSX.Element[]>([]);
    const [probabilityBtns, setProbabilityBtns] = React.useState<JSX.Element[]>([]);

    const onChangeImpact = (newValue: number | undefined) => {

        setImpactVal(newValue ?? -1);
        props.onChange(newValue ?? -1, probabilityVal , riskVal);
    }
    const onChangeProbability = (newValue: number | undefined) => {
        setProbabilityVal(newValue ?? -1);
        props.onChange(impactVal , newValue ?? -1, riskVal );
    }

    const getCalculateRisk = (impactVal: number, probabilityVal: number, riskDefinition: RiskDefinition): number => {
        const getRiskValueFromOptions = (val: string): number => {
            return riskOptions.find((item) => item.Value.toString() === val)?.Value ?? -1
        }
        const findRisk = (impactVal: number, probabilityVal: number, riskDefinition: RiskDefinition)=>{
            for (const [key, value] of Object.entries(riskDefinition)) {
                const v= value.find((item) => item.impact === impactVal && item.probability === probabilityVal)
                if(v!== undefined)
                    return key;
            }
            return "";
        }

        const _risk= findRisk(impactVal, probabilityVal, riskDefinition);
        return (_risk !== "")
            ?getRiskValueFromOptions(_risk)
            :-1;
    }
    const getRiskLabelFromOptions = (val: number): string => {
        return riskOptions.find((item) => item.Value === val)?.Label ?? ""
    }
    const renderChartValue = (_: [number, number]): string => {
        return "";
    }

    React.useEffect(() => {
        const getButtons = (options: ComponentFramework.PropertyHelper.OptionMetadata[], value: number | null, onChange: (newValue: number | undefined) => void) => {
            return options.map((item) => {
                return (
                    <ButtonToggle
                        key={`${Date.now()}${item.Value}`}
                        item={item}
                        checked={item.Value == value}
                        onChange={onChange}
                    />)
            })
        }
        const parseRiskDefinition = (riskDefinition: string): RiskDefinition | null => {
            if (riskDefinition !== "") {
                try {
                    return JSON.parse(riskDefinition) as RiskDefinition;
                }
                catch (e) {
                    setErrMsg("Invalid JSON definition for risks")
                    console.log(e);
                }
            }
            return null;
        }
        const getGaugeSegments = (riskOptions: ComponentFramework.PropertyHelper.OptionMetadata[]): IGaugeChartSegment[] =>{
            return riskOptions.map((item)=>{
                return {
                    size: segmentSize,
                    color: item.Color ?? tokens.colorBrandBackground2Hover,
                    legend: item.Label ?? "",
                    hideMinMax: true
                }
            })
        }

        const risksDefinition = parseRiskDefinition(props.riskDefinition);

        setImpactBtns(getButtons(impactOptions, props.impactValue, onChangeImpact));
        setProbabilityBtns(getButtons(probabilityOptions, props.probabilityValue, onChangeProbability));

        setGaugeSegments(getGaugeSegments(riskOptions));

        if (props.impactValue !== -1 && props.probabilityValue !== -1 && risksDefinition !== null) {
            const risk = getCalculateRisk(props.impactValue, props.probabilityValue, risksDefinition);
            if (risk !== props.riskValue) {
                setRiskVal(risk);
                props.onChange(props.impactValue, props.probabilityValue, risk);
            }
            setGaugeValue(risk * segmentSize + segmentSize / 2);

        }

    }, [])


    return (<IdPrefixProvider value="IDAPPS-OptionSetChoiceGroup">
        <FluentProvider theme={webLightTheme} className={styles.container} >
            {impactBtns && impactBtns.length > 0 &&
                <div>
                <Text>{impactLabel}</Text>
                <div className={styles.root}>
                    {impactBtns}
                </div >
            </div>
            }
            {probabilityBtns && probabilityBtns.length > 0 &&
                <div>
                    <Text>{probabilityLabel}</Text>
                <div className={styles.root}>
                    {probabilityBtns}
                </div >
                </div>
            }

            {gaugeValue&& gaugeSegments.length > 0 &&(
                <GaugeChart
                    width={140}
                    height={55}
                    segments={gaugeSegments}
                    chartValue={gaugeValue}
                    hideMinMax={true}
                    hideTooltip={true}
                    // sublabel={getRiskLabelFromOptions(riskVal)}
                    chartValueFormat={renderChartValue}
                    hideLegend={true}
                ></GaugeChart>

            )}
        </FluentProvider>
    </IdPrefixProvider >)
}
export default CalculateRisk;