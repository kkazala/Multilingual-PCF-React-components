import * as React from "react";
import CalculateRisk, { ControlProps } from "./CalculateRisk";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

const Risks = {
    "2": [
        {
            "impact": 2,
            "probability": 2
        },
        {
            "impact": 2,
            "probability": 1
        }
    ],
    "1": [
        {
            "impact": 2,
            "probability": 0
        },
        {
            "impact": 1,
            "probability": 1
        },
        {
            "impact": 1,
            "probability": 2
        }
    ],
    "0": [
        {
            "impact": 1,
            "probability": 0
        },
        {
            "impact": 0,
            "probability": 0
        },
        {
            "impact": 0,
            "probability": 1
        },
        {
            "impact": 0,
            "probability": 2
        }
    ]
}

export class RiskAssessment implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
    selectedImpact: number | undefined;
    selectedProbability: number | undefined;
    selectedRisk: number | undefined;

    // https://react.fluentui.dev/?path=/docs/concepts-migration-from-v8-components-charts-migration--page

    constructor() { }

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
        state: ComponentFramework.Dictionary
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
        const { impact, impactLabel, probability, probabilityLabel, risk, risksDefinitions, showInline, showRisk } = context.parameters;

        const getControlProps = (sourceControl: ComponentFramework.PropertyTypes.OptionSetProperty, disabled: boolean): ControlProps =>{
            if (sourceControl.security) return{
                disabled : disabled || !sourceControl.security.editable,
                masked : !sourceControl.security.readable
            }
            return {
                disabled,
                masked:false
            }
        }

        const disabled = context.mode.isControlDisabled;

        return React.createElement(
            CalculateRisk, {
                key:Date.now(),
                impactLabel: impactLabel.raw ?? "",
                impactOptions: impact.attributes?.Options ?? [],
                impactValue: impact.raw ??-1,
                impactProps:getControlProps(impact,disabled),
                probabilityLabel: probabilityLabel.raw ?? "",
                probabilityOptions: probability.attributes?.Options ?? [],
                probabilityValue: probability.raw??-1,
                probabilityProps:getControlProps(probability,disabled),
                riskOptions: risk.attributes?.Options ?? [],
                riskValue: risk.raw??-1,
                riskProps:getControlProps(risk,disabled),
                onChange: this.onChange,
                riskDefinition: risksDefinitions.raw ?? "",
                showInline: showInline.raw ?? true,
                showRisk: showRisk.raw ?? true
            }
        );
    }
    onChange = (newImpact: number | undefined, newProbability: number | undefined, newRisk: number | undefined): void => {
        const notify= this.selectedImpact!== newImpact || this.selectedProbability !== newProbability
        this.selectedImpact = newImpact;
        this.selectedProbability = newProbability;
        this.selectedRisk = newRisk;    //risk is saved back to the control but does not trigger a re-render because it cannot be changed by the user
        if(notify){
            this.notifyOutputChanged();
        }
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {

        return {
            impact: this.selectedImpact ?? -1,
            probability: this.selectedProbability ?? -1,
            risk: this.selectedRisk ?? -1
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
