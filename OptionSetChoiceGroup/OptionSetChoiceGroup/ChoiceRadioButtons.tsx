import { FluentProvider, IdPrefixProvider, Radio, RadioGroup, RadioGroupOnChangeData, webLightTheme } from '@fluentui/react-components';
import * as React from 'react';


export interface IChoiceRadioButtonsProps {
  label: string;
  value: number | null;
  options: ComponentFramework.PropertyHelper.OptionMetadata[];
  showHorizontal: boolean | null;
  onChange: (newValue: number | undefined) => void;
  disabled: boolean;
  masked: boolean;
}

type RadioProps={
  value:string;
  label:string;
  disabled:boolean;
  checked:boolean;
}

const ChoiceRadioButtons = (props: IChoiceRadioButtonsProps) => {
  const [selectedKey, setSelectedKey] = React.useState<string | undefined>(undefined);
  const [options, setOptions] = React.useState<RadioProps[]>([]);
  const [isReady, setIsReady] = React.useState<boolean>(false);

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

    setSelectedKey(props.value?.toString());

    const _options = getOptions(props.options, props.value);
    setOptions(_options);

    setIsReady(true);

  }, [props.options, props.showHorizontal, props.value]);

  const onChange = React.useCallback((ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => {
    props.onChange(data?.value ? parseInt(data.value) : undefined);
  }, []);

  return (<IdPrefixProvider value="IDAPPS-OptionSetChoiceGroup">
    <FluentProvider theme={webLightTheme}>
      {isReady &&
        <RadioGroup value={selectedKey} onChange={onChange} layout={props.showHorizontal?"horizontal":"vertical"}>
          {options.map((option) => {
            return <Radio key={option.value} {...option} />
          })}

        </RadioGroup>
      }
    </FluentProvider>
  </IdPrefixProvider >
  );


}

export default ChoiceRadioButtons;