import React from 'react';
import './CustomTextEditor.scss';
import {Editor} from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {toolbarConfig} from "./config";

const CustomTextEditor = ({ htmlContent, onContentChange = () => {}, onBlur, onFocus, showPreview, placeholder, label }) => {

    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

    // Initialize with content
    React.useEffect(() => {
        if (!htmlContent || editorState.getCurrentContent().hasText()) return;

        const contentBlock = htmlToDraft(htmlContent)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState);
        }
    }, [ htmlContent ])


    const onEditorStateChange = (newState) => {
        setEditorState(newState);
        onContentChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }

    return (
        <div className="t4e-text-editor">
            <div className="editor-label">
                { label || '' }
            </div>
            <Editor
                placeholder={placeholder || ''}
                toolbar={toolbarConfig}
                onBlur={() => {
                    onContentChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
                onFocus={onFocus}
                editorState={editorState}
                wrapperClassName="t4e-editor-wrapper"
                editorClassName="t4e-editor"
                onEditorStateChange={onEditorStateChange}
            />
            {
                showPreview ? (
                    <textarea
                        disabled
                        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                    />
                ) : null
            }
        </div>
    )
}

export default CustomTextEditor;
