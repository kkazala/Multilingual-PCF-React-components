import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from '@fluentui/react';
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


const ChoiceRadioButtons = (props: IChoiceRadioButtonsProps) => {
  const [selectedKey, setSelectedKey] = React.useState<string | undefined>(undefined);
  const [options, setOptions] = React.useState<IChoiceGroupOption[]>([]);
  const [styles, setStyles] = React.useState<Partial<IChoiceGroupStyles>>({})
  const [isReady, setIsReady] = React.useState<boolean>(false);

  React.useEffect(() => {

    const getOptions = (options: ComponentFramework.PropertyHelper.OptionMetadata[], value: number | null): IChoiceGroupOption[] => {
      return options.map((item) => {
        return {
          key: item.Value.toString(),
          text: `${item.Label}\u00A0\u00A0\u00A0\u00A0`,
          disabled: props.disabled,
          checked: item.Value == value
        };
      })
    }

    const getStyles = (showHorizontal: boolean | null): Partial<IChoiceGroupStyles> => {
      return {
        flexContainer: {
          display: showHorizontal ? 'flex' : 'block',
          flexDirection: showHorizontal ? 'row' : 'column',
        }
      }
    }
    const _styles = getStyles(props.showHorizontal);
    setStyles(_styles);

    setSelectedKey(props.value?.toString());

    const _options = getOptions(props.options, props.value);
    setOptions(_options);

    setIsReady(true);

  }, [props.options, props.showHorizontal, props.value]);

  const onChange = React.useCallback((ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option: IChoiceGroupOption | undefined) => {
    props.onChange(option?.key ? parseInt(option.key) : undefined);
  }, []);

  return (<>
    {isReady &&
      <ChoiceGroup styles={styles} defaultSelectedKey={selectedKey} options={options} onChange={onChange} />
    }
  </>
  );


}

export default ChoiceRadioButtons;