import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import RiskAssessmentPanel, { ControlProps } from "./RiskAssessmentPanel";

export class RiskAssessment implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
    selectedImpact: number | undefined;
    selectedProbability: number | undefined;
    selectedRisk: number | undefined;
    isRiskBound:boolean;

    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
    }
    public onChange = (newImpact: number | undefined, newProbability: number | undefined, newRisk: number | undefined): void => {
        this.selectedImpact = newImpact;
        this.selectedProbability = newProbability;
        this.selectedRisk = newRisk;

        this.notifyOutputChanged();
    };
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const { impact, impactLabel, probability, probabilityLabel, risk, risksDefinitions, showInline, labelInline, showRisk } = context.parameters;
        const disabled = context.mode.isControlDisabled;
        this.isRiskBound = risk !== undefined && risk.type !== null;

        const getControlProps = (sourceControl: ComponentFramework.PropertyTypes.OptionSetProperty, disabled: boolean): ControlProps => {
            if (sourceControl.security) return {
                disabled: disabled || !sourceControl.security.editable,
                masked: !sourceControl.security.readable
            }
            return {
                disabled,
                masked: false
            }
        }

        return React.createElement(
            RiskAssessmentPanel, {
                impactLabel: impactLabel.raw ?? "",
                impactOptions: impact.attributes?.Options ?? [],
                impactValue: impact.raw ?? -1,
                impactProps: getControlProps(impact, disabled),
                probabilityLabel: probabilityLabel.raw ?? "",
                probabilityOptions: probability.attributes?.Options ?? [],
                probabilityValue: probability.raw ?? -1,
                probabilityProps: getControlProps(probability, disabled),
                riskOptions: risk.attributes?.Options ?? [],
                riskValue: risk.raw ?? -1,
                riskProps: getControlProps(risk, disabled),
                onChange: this.onChange,
                riskDefinition: risksDefinitions.raw ?? "",
                showInline: showInline.raw ?? true,
                showRisk: showRisk.raw ?? true,
                labelInline: labelInline.raw ?? true,
            }
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        const results=  {
            impact: this.selectedImpact,
            probability: this.selectedProbability,
        } as IOutputs;

        return this.isRiskBound
                ? {
                    ...results,
                    risk: this.selectedRisk
                }
                : results;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
