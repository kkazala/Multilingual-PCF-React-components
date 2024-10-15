import * as React from "react";
import ChoicesButtons from "./ChoicesButtons";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

const SmallFormFactorMaxWidth = 350;

export class OptionSetButtons implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
    selectedValue: number | undefined;

    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const { sourceControl } = context.parameters;

        let disabled = context.mode.isControlDisabled;
        let masked = false;
        if (sourceControl.security) {
            disabled = disabled || !sourceControl.security.editable;
            masked = !sourceControl.security.readable;
        }

        return React.createElement(
            ChoicesButtons,{
                key:Date.now(),
                label: sourceControl.attributes?.DisplayName??'',
                value: sourceControl.raw,
                options: sourceControl.attributes?.Options??[],
                onChange: this.onChange,
                disabled: disabled,
                masked: masked,
            }
        );
    }
    onChange = (newValue: number | undefined): void => {
        this.selectedValue = newValue;
        this.notifyOutputChanged();
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {

        return {
            sourceControl: this.selectedValue?? -1,
        }
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
