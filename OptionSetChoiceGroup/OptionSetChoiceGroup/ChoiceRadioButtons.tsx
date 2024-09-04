import { FluentProvider, IdPrefixProvider, Label, Radio, RadioGroup, RadioGroupOnChangeData, makeStyles, webLightTheme } from '@fluentui/react-components';
import * as React from 'react';


export interface IChoiceRadioButtonsProps {
  label: string;
  value: number | null;
  options: ComponentFramework.PropertyHelper.OptionMetadata[];
  showHorizontal: boolean | string| null;
  showInline: boolean | string| null;
  onChange: (newValue: number | undefined) => void;
  disabled: boolean;
  masked: boolean;
  lcid: string;
}

type RadioProps={
  value:string;
  label:string;
  disabled:boolean;
  checked:boolean;
}

const useStyles = makeStyles({
  container: {
    width: '100%',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  alignRight:{
    marginLeft: 'auto'
  },
 nowrap:{
  '> *':{
    whiteSpace: 'nowrap'
  }
 }
});

const ChoiceRadioButtons = (props: IChoiceRadioButtonsProps) => {
  const {disabled,masked}= props
  const [selectedKey, setSelectedKey] = React.useState<string | undefined>(undefined);
  const [options, setOptions] = React.useState<RadioProps[]>([]);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [label, setLabel] = React.useState<string>("");
  const [isHorizontal, setIsHorizontal] = React.useState<boolean>(false);
  const [isInline, setIsInline] = React.useState<boolean>(false);


  const styles= useStyles();

  const getValueLocalized = (textValue: string, lcid:string): string => {

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
    if ( typeof parsedResult === "object" &&
      Object.keys(parsedResult).includes(lcid)) {
      return parsedResult[lcid as keyof typeof parsedResult];
    }
    return textValue;
  }

  React.useEffect(() => {

    const getOptions = (options: ComponentFramework.PropertyHelper.OptionMetadata[], value: number | null): RadioProps[] => {
      return options.map((item) => {
        return {
          value: item.Value.toString(),
          label: item.Label,
          disabled: props.disabled,
          checked: item.Value == value
        };
      })
    }
    setIsHorizontal(props.showHorizontal === true || props.showHorizontal === "true");
    setIsInline(props.showInline === true || props.showInline === "true");

    setLabel(getValueLocalized(props.label, props.lcid));

    setSelectedKey(props.value?.toString());

    const _options = getOptions(props.options, props.value);
    setOptions(_options);

    setIsReady(true);

  }, [props.options, props.showHorizontal, props.showInline, props.value]);

  const onChange = React.useCallback((ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => {
    props.onChange(data?.value ? parseInt(data.value) : undefined);
  }, []);

  return (<IdPrefixProvider value="IDAPPS-OptionSetChoiceGroup">
    <FluentProvider theme={webLightTheme} className={styles.container}>
      <div className={isInline ? styles.horizontal : styles.root }>
      {label &&
        <Label >{label}</Label >
      }
      {masked &&<>***</>}
      {isReady && !masked &&
          <RadioGroup
            className={isInline ?styles.alignRight:""}
            value={selectedKey}
            onChange={onChange}
            layout={isHorizontal ?"horizontal":"vertical"}
            disabled={disabled}
            >
          {options.map((option) => {
            return <Radio key={option.value} {...option} className={styles.nowrap} />
          })}
        </RadioGroup>
      }
      </div>
    </FluentProvider>
  </IdPrefixProvider >
  );


}

export default ChoiceRadioButtons;