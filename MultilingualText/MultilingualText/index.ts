import * as React from "react";
import LocalizedText from "./LocalizedText";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class MultilingualText implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     *
     * The ReactControl.init method for control initialization doesn't have div parameters because React controls don't
     * render the DOM directly. Instead ReactControl.updateView returns a ReactElement that has the details of the actual
     * control in React format.
     *
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        // this.context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        const { textValue, textCSS, sourceControl } = context.parameters;

        const isAuthoringMode = sourceControl === undefined; // in edit mode: all parameters if empty are 'undefined'
        const isBound = sourceControl!== undefined && sourceControl.type!==null;

        const show = isAuthoringMode
                    || !isBound  // always show if not bound and has text
                    || sourceControl.raw === true; //if bound, check the value true/false
        let disabled = context.mode.isControlDisabled;
        let masked = false;


        //If bound to control, check security
        if (isBound &&  sourceControl.security) {
            disabled = disabled || !sourceControl.security.editable;
            masked = !sourceControl.security.readable;
        }

        return show && !masked
            ? React.createElement(
                LocalizedText, {
                key: Date.now().toString(),
                textValue: textValue?.raw ?? '',
                textCSS: textCSS?.raw ?? '',
                lcid: context.userSettings.languageId.toString(),
                disabled: disabled,
                masked: masked,
                    required: sourceControl.attributes?.RequiredLevel ?? 0
            }
            )
            : React.createElement(React.Fragment, null);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }


    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
