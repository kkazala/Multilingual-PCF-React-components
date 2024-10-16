import * as React from 'react';
import { requiredLevelsEnum } from './Utils';

export const Required = (props: { required: number }): JSX.Element => {
    if (props.required === requiredLevelsEnum.Required) {
        //add , font-weight:400 to the style to make it normal
        return <span style={{ color: 'rgb(188, 47, 50)', fontWeight: 400 }}>*</span>;
    }
    else if (props.required === requiredLevelsEnum.Recommended) {
        return <span id="id-required-icon" aria-hidden="true" style={{ color: 'rgb(15, 108, 189)', fontWeight: 400 }}>⁺</span>;
    }
    else {
        return <span>+</span>;
    }
}

export const ParsedHTML = (html: string): JSX.Element => {
    return <div dangerouslySetInnerHTML={{
        __html: html    // this is the line that renders the HTML
    }}></div>;
}