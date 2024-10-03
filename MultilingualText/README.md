# Multilingual text

In model-driven applications, static text can be displayed in two ways:

- By adding a Web Resource
- By associating a custom component with a control on the form

One drawback of using Web Resources is that their height must be predefined and will not adjust according to the content.

In contrast, using custom components offers greater flexibility. This approach ensures that only the necessary space for the text is utilized, while also allowing you to control text visibility based on the values or visibility of associated controls. You can use this method to always display certain text, while showing other text only for new (unsaved) forms or depending on the values of other controls.

This control enables you to specify different text for various supported languages and apply formatting. It also adheres to the source control's configuration, considering whether column security is enabled and whether the field is marked as Business required, Business recommended, or optional.

# Confguration

To configure the control, make sure you have an additional field added to the form:
- `Yes/no` field which defines whether the control will display the values

Associate the `Multilingual Static Text` component with the `Yes/no` field, add text to the Text property (either simple text, or a json for multilingual support) and CSS style to the Text Style.

The following configuration:

![alt text](./images/configuration.png)

displays the following text:

![alt text](./images/result.png)

If the source control settings are changed to "Business recommended", the red asterisk will be replaced with a blue +.
Remember that just like in the case of out-of-the-box controls you need to refresh the page for the "required level" change to take effect.

![alt text](./images/result2.png)

## Visibility

The visibility of the control and the value of the `Yes/no` field both determine whether the summary is shown.

However, there's a distinction: if the control is visible but its value is set to `false`, the summary won't be displayed, but the control will still take up space, appearing as an empty row. If this is the only control in a section, the section will remain visible.

Only by hiding the control - using a business rule or JavaScript - will the space not be allocated.