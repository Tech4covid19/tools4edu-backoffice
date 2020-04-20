import React from 'react';
import {Formik} from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RichTextEditor } from "../../../../../components/RichTextEditor/RichTextEditor";
import {convertFromHTML, EditorState, ContentState} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Button from "@material-ui/core/Button";

const defaultInitialValues = {
    title: '',
    summary: '',
    author: '',
    images: '',
    text: '',
    slug: '',
    published: false
};

const ArticleForm = ({ initialValues = defaultInitialValues, onSubmit, onCancel, actionLabel }) => {
    const blocksFromHTMLSummary = convertFromHTML(initialValues ? initialValues.summary : '');
    const blocksFromHTMLText = convertFromHTML(initialValues ? initialValues.text : '');

    return (
        <Formik
            initialValues={{
                ...initialValues,
                editorStateSummary: initialValues && initialValues.summary !== '' ?
                    new EditorState.createWithContent(ContentState.createFromBlockArray(
                        blocksFromHTMLSummary.contentBlocks,
                        blocksFromHTMLSummary.entityMap
                    )) :
                    new EditorState.createEmpty(),
                editorStateText: initialValues && initialValues.text !== '' ?
                    new EditorState.createWithContent(ContentState.createFromBlockArray(
                        blocksFromHTMLText.contentBlocks,
                        blocksFromHTMLText.entityMap
                    )) :
                    new EditorState.createEmpty()
            }}
            validationSchema={ArticleFormSchema}
            onSubmit={(values, { setSubmitting }) => {
                let valuesToSubmit = {...values};

                delete valuesToSubmit.id;
                delete valuesToSubmit.createdAt;
                delete valuesToSubmit.updatedAt;
                delete valuesToSubmit.__typename;

                delete valuesToSubmit.editorStateText;
                delete valuesToSubmit.editorStateSummary;

                valuesToSubmit.summary = stateToHTML(values.editorStateSummary.getCurrentContent());
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
                <form className="te-form te-blog-article-form" onSubmit={handleSubmit}>
                    <div className="input-single">
                        <TextField name="title" label="Title"
                                   fullWidth
                                   value={values.title}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.title && touched.title}
                                   helperText={errors.title && touched.title ? errors.title : ''}
                                   variant="outlined"
                        />
                    </div>
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
                        <TextField name="images" label="Top Image URL"
                                   fullWidth
                                   value={values.images}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.images && touched.images}
                                   helperText={errors.images && touched.images ? errors.images : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <RichTextEditor
                            name="summary"
                            editorStateName="editorStateSummary"
                            label="Summary"
                            placeholder="Write here..."
                            editorState={values.editorStateSummary}
                            onChange={setFieldValue}
                            onBlur={handleBlur} onFocus={handleFocus}
                        />
                    </div>
                    <div className="input-single">
                        <RichTextEditor
                            name="text"
                            editorStateName="editorStateText"
                            label="Text"
                            placeholder="Write here..."
                            editorState={values.editorStateText}
                            onChange={setFieldValue}
                            onBlur={handleBlur} onFocus={handleFocus}
                        />
                    </div>

                    <div className="input-single">
                        <TextField name="slug" label="Slug"
                                   fullWidth
                                   value={values.slug}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.slug && touched.slug}
                                   helperText={errors.slug && touched.slug ? errors.slug : ''}
                                   variant="outlined"
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

const ArticleFormSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    slug: Yup.string().required('Slug is required'),
});

export default ArticleForm;
