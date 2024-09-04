import { IGaugeChartSegment } from '@fluentui/react-charting';
import { FluentProvider, IdPrefixProvider, makeStyles, Text, tokens, Tooltip, webLightTheme } from '@fluentui/react-components';
import { ShieldFilled, ShieldQuestionRegular } from '@fluentui/react-icons';
import * as React from 'react';
import ChoiceOptionsButtonSet from './ChoiceOptionsButtonSet';

export type ControlProps = {
  disabled: boolean;
  masked: boolean;
}
export type RiskAssessmentPanelProps = {
  impactLabel: string ;
  impactOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
  impactValue: number;
  impactProps: ControlProps;
  probabilityLabel: string;
  probabilityOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
  probabilityValue: number;
  probabilityProps: ControlProps;
  riskOptions: ComponentFramework.PropertyHelper.OptionMetadata[];
  riskValue: number;
  riskLabel: string;
  riskProps: ControlProps;
  riskDefinition: string;
  onChange: (newImpact: number, newProbability: number, newRisk: number) => void;
  showInline: boolean;
  showRisk: boolean;
  labelInline: boolean;
  lcid: string;
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
      minHeight:"1.25em"
    }
  },
  labelVertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',

    '> span': {
      minWidth: '100px',
      marginInlineEnd: '4px',
      paddingBottom: '4px',
      textAlign: 'left',
      minHeight: "1.25em"
    }
  },
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
const RiskAssessmentPanel = (props: RiskAssessmentPanelProps): JSX.Element => {
  const styles = useStyles();
  const { impactOptions, probabilityOptions, riskOptions, showInline, labelInline, showRisk, lcid } = props;
  const [riskDefinition, setRiskDefinition] = React.useState<RiskDefinition | undefined>();
  const [impactVal, setImpactVal] = React.useState<number>(props.impactValue);
  const [probabilityVal, setProbabilityVal] = React.useState<number>(props.probabilityValue);
  const [riskVal, setRiskVal] = React.useState<number>(props.riskValue);
  const [gaugeSegments, setGaugeSegments] = React.useState<IGaugeChartSegment[]>([]);
  const [gaugeValue, setGaugeValue] = React.useState<number>(0);
  const [color, setColor] = React.useState<string>(tokens.colorNeutralBackground2);
  const [impactLabel,setImpactLabel] = React.useState<string>(props.impactLabel);
  const [probabilityLabel,setProbabilityLabel] = React.useState<string>(props.probabilityLabel);
  const [riskLabel,setRiskLabel] = React.useState<string>(props.riskLabel);

  const [errMsg, setErrMsg] = React.useState<string>("");

  const iconColorStyle = React.useMemo(() => ({
    ['color']: color,
  }), [color])

  const getValueLocalized = (textValue: string, lcid: string): string => {

    const replaceNewlinesWithinQuotes = (input: string): string => {
      return input.replace(/("[^"]*")/g, (match, quotedString) => {
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
    if (typeof parsedResult === "object" &&
      Object.keys(parsedResult).includes(lcid)) {
      return parsedResult[lcid as keyof typeof parsedResult];
    }
    return textValue;
  }

  const onChangeImpact = (newValue: number | undefined, probabilityVal: number, riskVal: number) => {
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
  const setRiskColorFromOptions = (val: number): void => {
    const color = riskOptions.find((item) => item.Value === val)?.Color ?? tokens.colorBrandBackground
    setColor(color)
  }

  React.useEffect(() => {
    const parseRiskDefinition = (riskDefinition: string): RiskDefinition | undefined => {
      if (riskDefinition !== "") {
        try {
          return JSON.parse(riskDefinition) as RiskDefinition;
        }
        catch (e) {
          setErrMsg("Invalid JSON definition for risks")
          console.log(e);
        }
      }
    }
    setImpactLabel(getValueLocalized(props.impactLabel, lcid));
    setProbabilityLabel(getValueLocalized(props.probabilityLabel, lcid));
    setRiskLabel(getValueLocalized(props.riskLabel, lcid));

    setRiskDefinition(
      parseRiskDefinition(props.riskDefinition)
    );
    setRiskColorFromOptions(props.riskValue)

  }, []);

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


    if (riskDefinition && riskOptions.length > 0) {
      const risk = getCalculateRisk(impactVal, probabilityVal, riskDefinition);
      if (risk != riskVal) {
        props.onChange(impactVal, probabilityVal, risk);

        setRiskVal(risk);
        if (showInline) {
          setRiskColorFromOptions(risk)
        }

      }
    }
  }, [impactVal, probabilityVal, showRisk]);

  React.useEffect(() => {
  }, [showInline, labelInline]);

  return (<IdPrefixProvider value="IDAPPS-OptionSetChoiceGroup">
    <FluentProvider theme={webLightTheme} className={showInline ? styles.containerInline : styles.container} >

      <div className={labelInline ? styles.labelInline : styles.labelVertical}>
        { (showInline  || impactLabel) &&
          <Text >{impactLabel}</Text>
        }
        {impactOptions.length > 0 && <ChoiceOptionsButtonSet
          key={`btnSet1${impactVal}_${probabilityVal}`}
          options={impactOptions}
          value={impactVal}
          onChange={(val) => {
            onChangeImpact(val, probabilityVal, riskVal)
          }}
        />
        }
      </div>
      <div className={labelInline ? styles.labelInline : styles.labelVertical}>
        <Text >{probabilityLabel}</Text>
        {probabilityOptions.length > 0 && <ChoiceOptionsButtonSet
          key={`btnSet2${impactVal}_${probabilityVal}`}
          options={probabilityOptions}
          value={probabilityVal}
          onChange={(val) => {
            onChangeProbability(impactVal, val, riskVal)
          }}
        />
        }
      </div>
      {showRisk && riskOptions.length > 0 &&
        <div className={labelInline ? styles.labelInline : styles.labelVertical}>
          <Text >{riskLabel }</Text>
          {showInline
            ? <>
              {riskVal != -1
              ? <Tooltip content={getRiskLabelFromOptions(riskVal)} relationship="description">
                {/* FireFilled */}
                  <ShieldFilled className={styles.riskIcon} style={iconColorStyle as React.CSSProperties} />
                </Tooltip>
              : <ShieldQuestionRegular className={styles.riskIconUnknown} />
              }
            </>
            : <>Risk {riskVal}</>
          }
        </div>
      }
    </FluentProvider>
  </IdPrefixProvider >)
}

export default RiskAssessmentPanel;
