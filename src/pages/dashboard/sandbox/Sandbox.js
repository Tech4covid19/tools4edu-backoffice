import React from 'react';
import './Sandbox.scss';
import CustomTextEditor from "../../../components/CustomTextEditor/CustomTextEditor";

const Sandbox = () => {
    return (
        <div className="sandbox">
            <div className="text-editor-container">
                <CustomTextEditor
                    showPreview={true}
                />
            </div>
        </div>
    )
}

export default Sandbox;
