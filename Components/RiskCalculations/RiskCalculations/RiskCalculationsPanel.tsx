import { FluentProvider, IdPrefixProvider, makeStyles, Text, tokens, webLightTheme } from '@fluentui/react-components';
import * as React from 'react';
import ChoiceOptionsButtonSet from './ChoiceOptionsButtonSet';
import RiskResult from './RiskResult';

export type ControlProps = {
  disabled: boolean;
  masked: boolean;
}
export type RiskCalculationsPanelProps = {
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
  riskIcon:string;
  riskDefinition: string;
  onChange: (newImpact: number, newProbability: number, newRisk: number) => void;
  showInline: boolean;
  showRisk: boolean;
  labelInline: boolean;
  lcid: string;
  showRiskPlaceholder: boolean;
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
    display: 'table',
    flexDirection: 'column',
    borderSpacing: '5px',
    alignItems: 'start',
    '> :not(:first-child)': {
      marginTop: '10px',
    },
  },
  //horizontal
  containerInline: {
    display: 'flex',
    borderSpacing: '5px',
    flexDirection: 'row',
    alignItems: 'center',
    '> :not(:first-child)': {
      marginTop: '0px',
      marginLeft: '15px'
    },
  },
  //horizontal
  labelInline: {
    display: 'table-row',
    flexDirection: 'row',

    '> span' : {
      display: 'table-cell',
      minHeight:"1.25em",
      verticalAlign: 'middle'
    },
    '> div': {
    display: 'table-cell',
    minHeight: "1.25em",
    verticalAlign: 'middle'
    },
    '> div > svg': {
      display:'block'
    }

  },
  //vertical
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
    },
    '> div > svg': {
      display: 'block'
    }
  }
});

const RiskCalculationsPanel = (props: RiskCalculationsPanelProps): JSX.Element => {
  const styles = useStyles();
  const { impactOptions, probabilityOptions, riskOptions, showInline, labelInline, showRisk, lcid, riskIcon, showRiskPlaceholder } = props;
  const [riskDefinition, setRiskDefinition] = React.useState<RiskDefinition | undefined>();
  const [impactVal, setImpactVal] = React.useState<number>(props.impactValue);
  const [probabilityVal, setProbabilityVal] = React.useState<number>(props.probabilityValue);
  const [riskVal, setRiskVal] = React.useState<number>(props.riskValue);
  const [impactLabel,setImpactLabel] = React.useState<string>(props.impactLabel);
  const [probabilityLabel,setProbabilityLabel] = React.useState<string>(props.probabilityLabel);
  const [riskLabel,setRiskLabel] = React.useState<string>(props.riskLabel);

  const [errMsg, setErrMsg] = React.useState<string>("");

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
  const getRiskColorFromOptions = (val: number): string => {
    return riskOptions.find((item) => item.Value === val)?.Color ?? tokens.colorBrandBackground
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
      }
    }
  }, [impactVal, probabilityVal, showRisk]);

  React.useEffect(() => {
  }, [showInline, labelInline]);

  return (<IdPrefixProvider value="PCF-OptionSetChoiceGroup">
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
      {showRisk && (showRiskPlaceholder || riskOptions.length > 0 ) &&
        <div className={labelInline ? styles.labelInline : styles.labelVertical}>
          <RiskResult
                riskIcon={riskIcon}
                riskLabel={riskLabel}
                riskDescription={riskVal != -1  ? getRiskLabelFromOptions(riskVal):""}
                riskColor={riskVal != -1 ? getRiskColorFromOptions(riskVal):undefined}
          />
        </div>
      }
    </FluentProvider>
  </IdPrefixProvider >)
}

export default RiskCalculationsPanel;
