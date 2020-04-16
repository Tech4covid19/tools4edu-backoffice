import React from 'react';
import {Formik} from "formik";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RichTextEditor } from "../../../../../components/RichTextEditor/RichTextEditor";
import {convertFromHTML, EditorState, ContentState} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Button from "@material-ui/core/Button";

const defaultInitialValues = {
    author: 0,
    occupation: '',
    text: '',
    published: false
};

const TestimonyForm = ({ initialValues = defaultInitialValues, onSubmit, onCancel, actionLabel }) => {

    const blocksFromHTMLText = convertFromHTML(initialValues ? initialValues.text : '');

    return (
        <Formik
            initialValues={{
                ...initialValues,
                editorStateText: initialValues && initialValues.text !== '' ?
                    new EditorState.createWithContent(ContentState.createFromBlockArray(
                        blocksFromHTMLText.contentBlocks,
                        blocksFromHTMLText.entityMap
                    )) :
                    new EditorState.createEmpty()
            }}
            onSubmit={(values, { setSubmitting }) => {


                let valuesToSubmit = {...values};

                delete valuesToSubmit.id;
                delete valuesToSubmit.createdAt;
                delete valuesToSubmit.updatedAt;
                delete valuesToSubmit.__typename;

                delete valuesToSubmit.editorStateText;

                valuesToSubmit.text = stateToHTML(values.editorStateText.getCurrentContent());

                onSubmit(valuesToSubmit)
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleFocus,
                  handleSubmit,
                  status,
                  isSubmitting,
                  setFieldValue
              }) => (
                <form className="te-form te-faq-form" onSubmit={handleSubmit}>
                    <div className="input-single">
                        <TextField name="author" label="Author"
                                   fullWidth
                                   value={values.author}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.author && touched.author}
                                   helperText={errors.author && touched.author ? errors.author : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <TextField name="occupation" label="Occupation"
                                   fullWidth
                                   value={values.occupation}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.occupation && touched.occupation}
                                   helperText={errors.occupation && touched.occupation ? errors.occupation : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <RichTextEditor
                            name="text"
                            label="Text"
                            placeholder="Write here..."
                            editorState={values.editorStateText}
                            onChange={setFieldValue}
                            onBlur={handleBlur} onFocus={handleFocus}
                        />
                    </div>
                    <div className="input-single">
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.published}
                                        onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                        error={!!errors.published && touched.published}
                                        helperText={errors.published && touched.published ? errors.published : ''}
                                        color="primary"
                                        name="published"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                }
                                label="is Published ?"
                            />
                        </FormControl>
                    </div>
                    <div className="form-actions">
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            type="submit"
                        >
                            { actionLabel }
                        </Button>
                    </div>
                </form>
            )}
        </Formik>

    )
};

export default TestimonyForm;