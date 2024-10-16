import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import ResizableText from "./ResizableText";

export class ResizableField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
    private newText: string | undefined;
    private triggerRerender: boolean = false;
    private key: string = Date.now().toString();

    constructor() { }
    /** Update control's content
     * When the text is updated by the user, the onChange and updateView methods are called in sequence.
     * When the text is updated by the model-driven app, only the updateView method is called.
     * To ensure that the control re-renders when the text is updated by the model-driven app, we need update the `key` value in the updateView method
     * However, if this happens when a user is typing, the control will lose focus and the user will have to click back into the control to continue typing.
     * To avoid this, we need to keep track of when the text is updated by the user and when it is updated by the model-driven app.
     * We can do this by setting a flag in the onChange method and checking the flag in the updateView method.
     *
     * context.factory.requestRender() has no effect
     */

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     *  However, it only fires when the control is refreshed or rendered... unles you update the key property
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const { sourceControl, placeholderHint, resizeChoice, height, maxHeight } = context.parameters;

        if(this.triggerRerender===false){
            this.triggerRerender=true;  //reset the flag to ensure that the control re-renders when the text is updated by the model-driven app
        }
        else{
            this.key = Date.now().toString(); //update the key value to force the control to re-render
        }

        let disabled = context.mode.isControlDisabled;
        let masked = false;
        if (sourceControl.security) {
            disabled = disabled || !sourceControl.security.editable;
            masked = !sourceControl.security.readable;
        }

        return React.createElement(
            ResizableText,{
                key: this.key,
                textValue: sourceControl?.raw || "",
                placeHolderText: placeholderHint?.raw || "",
                resizeChoice: resizeChoice?.raw || "0",
                height: height?.raw || 100,
                maxHeight: maxHeight?.raw || 650,
                disabled,
                masked,
                lcid: context.userSettings.languageId.toString(),
                onChange: this.onChange
            }
        );
        // ||  is falsy: false,0,"",NaN, null, undefined
        // ?? is nullish: null, undefined
    }
    onChange = (newValue: string ): void => {
        this.newText = newValue;
        this.triggerRerender=false; //do not re-render when the text is updated by the user
        this.notifyOutputChanged();
    };
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            sourceControl: this.newText ??""
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
