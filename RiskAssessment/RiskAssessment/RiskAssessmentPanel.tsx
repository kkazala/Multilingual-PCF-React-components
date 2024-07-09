import { IGaugeChartSegment } from '@fluentui/react-charting';
import { FluentProvider, IdPrefixProvider, makeStyles, Text, tokens, Tooltip, webLightTheme } from '@fluentui/react-components';
import { ShieldFilled } from '@fluentui/react-icons';
import * as React from 'react';
import ChoiceOptionsButtonSet from './ChoiceOptionsButtonSet';

export type ControlProps = {
  disabled: boolean;
  masked: boolean;
}
export type RiskAssessmentPanelProps ={
  impactLabel: string;
  impactOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
  impactValue: number;
  impactProps: ControlProps;
  probabilityLabel: string;
  probabilityOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
  probabilityValue: number;
  probabilityProps: ControlProps;
  riskOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
  riskValue: number;
  riskProps: ControlProps;
  riskDefinition: string;
  onChange: (newImpact: number, newProbability: number, newRisk: number) => void;
  showInline: boolean;
  showRisk: boolean;
  labelInline: boolean;
}
type RiskDefinition = {
  [key: string]: {
    impact: number;
    probability: number;
  }[]
}
const useStyles = makeStyles({
  //vertical
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    '> :not(:first-child)': {
      marginTop: '10px',
    },
  },
  containerInline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '> :not(:first-child)': {
      marginTop: '0px',
      marginLeft: '15px',
    },
  },
  labelInline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '> span': {
      marginInlineEnd: '4px',
    }
  },
  labelVertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',

    '> span':{
      minWidth: '100px',
      marginInlineEnd: '4px',
      paddingBottom: '4px',
      textAlign: 'center'
    }
  },
  riskIcon: {
    fontSize: "32px",
  }
});
const RiskAssessmentPanel = (props: RiskAssessmentPanelProps):JSX.Element => {
  const styles = useStyles();
  const { impactOptions, probabilityOptions, riskOptions, impactLabel, probabilityLabel, showInline, labelInline,showRisk } = props;
  const [riskDefinition, setRiskDefinition] = React.useState<RiskDefinition | null>(null);
  const [impactVal, setImpactVal] = React.useState<number>(props.impactValue);
  const [probabilityVal, setProbabilityVal] = React.useState<number>(props.probabilityValue);
  const [riskVal, setRiskVal] = React.useState<number>(props.riskValue);
  const [gaugeSegments, setGaugeSegments] = React.useState<IGaugeChartSegment[]>([]);
  const [gaugeValue, setGaugeValue] = React.useState<number>(0);
  const [color, setColor] = React.useState<string>(tokens.colorNeutralForeground3Hover);

  const [errMsg, setErrMsg] = React.useState<string>("");

  const onChangeImpact = (newValue: number | undefined, probabilityVal:number, riskVal:number) => {
    setImpactVal(newValue ?? -1);
    props.onChange(newValue ?? -1, probabilityVal, riskVal);
  }
  const onChangeProbability = (impactVal: number, newValue: number | undefined, riskVal: number) => {
    setProbabilityVal(newValue ?? -1);
    props.onChange(impactVal, newValue ?? -1, riskVal);
  }
  const getRiskLabelFromOptions = (val: number): string => {
    return riskOptions.find((item) => item.Value === val)?.Label ?? ""
  }

  React.useEffect(() => {
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

    setRiskDefinition(
      parseRiskDefinition(props.riskDefinition)
    );

  },[]);

  React.useEffect(() => {
    const getCalculateRisk = (impactVal: number, probabilityVal: number, riskDefinition: RiskDefinition): number => {
      const getRiskValueFromOptions = (val: string): number => {
        return riskOptions.find((item) => item.Value.toString() === val)?.Value ?? -1
      }
      const findRisk = (impactVal: number, probabilityVal: number, riskDefinition: RiskDefinition) => {
        for (const [key, value] of Object.entries(riskDefinition)) {
          const v = value.find((item) => item.impact === impactVal && item.probability === probabilityVal)
          if (v !== undefined)
            return key;
        }
        return "";
      }

      const _risk = findRisk(impactVal, probabilityVal, riskDefinition);
      return (_risk !== "")
        ? getRiskValueFromOptions(_risk)
        : -1;
    }
    const setRiskColorFromOptions = (val: number): void => {
      const color = riskOptions.find((item) => item.Value === val)?.Color ?? tokens.colorBrandBackground
      setColor(color)
    }

    if (riskDefinition && riskOptions.length > 0) {
      const risk = getCalculateRisk(impactVal, probabilityVal, riskDefinition);
      if (risk != riskVal){
        props.onChange(impactVal, probabilityVal, risk);

        setRiskVal(risk);
        if (showInline) {
          setRiskColorFromOptions(risk)
        }

      }
    }
  }, [impactVal, probabilityVal, showRisk]);

  return (<IdPrefixProvider value="IDAPPS-OptionSetChoiceGroup">
    <FluentProvider theme={webLightTheme} className={showInline ? styles.containerInline : styles.container} >

      <div className={labelInline?styles.labelInline:styles.labelVertical}>
        {impactLabel && <Text >{impactLabel}</Text> }
        {impactOptions.length > 0 && <ChoiceOptionsButtonSet
                key={`btnSet1${impactVal}_${probabilityVal}`}
                options={impactOptions}
                value={impactVal}
                onChange={(val)=>{
                  onChangeImpact(val, probabilityVal, riskVal)
                }}
              />
          }
      </div>
      <div className={labelInline ? styles.labelInline : styles.labelVertical}>
        {probabilityLabel && <Text >{probabilityLabel}</Text>}
        {probabilityOptions.length > 0 && <ChoiceOptionsButtonSet
                key={`btnSet2${impactVal}_${probabilityVal}`}
                options={probabilityOptions}
                value={probabilityVal}
                onChange={(val)=>{
                  onChangeProbability(impactVal, val, riskVal)
                }}
              />
        }
      </div>
      {showRisk && riskVal != -1 && riskOptions.length > 0 &&
        <>
        {showInline
          ? <>
            {riskVal != -1 && <Tooltip content={getRiskLabelFromOptions(riskVal)} relationship="description">
              {/* FireFilled */}
              <ShieldFilled className={styles.riskIcon}></ShieldFilled>
            </Tooltip> }
            </>
          : <>Risk {riskVal}</>
        }
        </>
      }
    </FluentProvider>
  </IdPrefixProvider >)
}

export default RiskAssessmentPanel;
