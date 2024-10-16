import { FluentProvider, IdPrefixProvider, Label, Radio, RadioGroup, RadioGroupOnChangeData, makeStyles, webLightTheme } from '@fluentui/react-components';
import * as React from 'react';
import { Required, Utils } from "../../_Utils";


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
  required: number;
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

    setLabel(Utils.GetValueLocalized(props.label, props.lcid));

    setSelectedKey(props.value?.toString());
    setOptions(getOptions(props.options, props.value));

    setIsReady(true);

  }, [props.options, props.showHorizontal, props.showInline, props.value]);

  const onChange = React.useCallback((ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => {
    props.onChange(data?.value ? parseInt(data.value) : undefined);
  }, []);

  return (<IdPrefixProvider value="PCF-OptionSetChoiceGroup">
    <FluentProvider theme={webLightTheme} className={styles.container}>
      <div className={isInline ? styles.horizontal : styles.root }>
        {label && <div role="presentation" style={{ display: "flex"}}>
        <Label >{label}</Label >
        <Required required={props.required} />
        </div>}
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