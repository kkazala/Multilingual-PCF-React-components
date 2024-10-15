import * as React from "react";
import PrintJSON from "./PrintJSON";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class JSONDisplay implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private context: ComponentFramework.Context<IInputs, IOutputs>;

    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     */
    public init(
        context: ComponentFramework.Context<IInputs>
    ): void {
        this.context = context;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        const { sourceControl, jsonVal } = context.parameters;

        const isAuthoringMode = sourceControl === undefined; // in edit mode: all parameters if empty are 'undefined'
        const isBound = sourceControl !== undefined && sourceControl.type !== null;

        const show = isAuthoringMode
            || !isBound  // always show if not bound and has text
            || sourceControl.raw === true; //if bound, check the value true/false

        let disabled = context.mode.isControlDisabled;
        let masked = false;

        //If bound to control, check security
        if (isBound && sourceControl.security) {
            disabled = disabled || !sourceControl.security.editable;
            masked = !sourceControl.security.readable;
        }

        return show && !masked
            ? React.createElement(
                PrintJSON,{
                    key:Date.now().toString(),
                    jsonVal: jsonVal?.raw ?? "",
                }
            )
            : React.createElement(React.Fragment, null);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
