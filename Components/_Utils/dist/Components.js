import * as React from 'react';
import { requiredLevelsEnum } from './Utils';
export const Required = (props) => {
    if (props.required === requiredLevelsEnum.Required) {
        //add , font-weight:400 to the style to make it normal
        return React.createElement("span", { style: { color: 'rgb(188, 47, 50)', fontWeight: 400 } }, "*");
    }
    else if (props.required === requiredLevelsEnum.Recommended) {
        return React.createElement("span", { id: "id-required-icon", "aria-hidden": "true", style: { color: 'rgb(15, 108, 189)', fontWeight: 400 } }, "\u207A");
    }
    else {
        return React.createElement("span", null, "+");
    }
};
export const ParsedHTML = (html) => {
    return React.createElement("div", { dangerouslySetInnerHTML: {
            __html: html // this is the line that renders the HTML
        } });
};
