import React from 'react';
import './ContentItemForm.scss';
import {Formik} from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { RichTextEditor } from "../../../../../components/RichTextEditor/RichTextEditor";
import {convertFromHTML, EditorState, ContentState} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Button from "@material-ui/core/Button";
import {useDashboardState} from "../../../DashboardState";

const defaultInitialValues = {
    order: '',
    videoUrl: '',
    videoTime: '',
    imageUrl: '',
    title: '',
    text: '',
    slug: '',
    published: false,
    stakeholders: [],
    providers: [],
    tags: []
};

const ContentItemForm = ({ initialValues = defaultInitialValues, onSubmit, onCancel, actionLabel }) => {
    const [{ stakeholders, providers }] = useDashboardState();

    const blocksFromHTML = convertFromHTML(initialValues ? initialValues.text : '');

    return (
        <Formik
            initialValues={{
                ...initialValues,
                editorState: initialValues && initialValues.text !== '' ?
                    new EditorState.createWithContent(ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap
                    )) :
                    new EditorState.createEmpty()
            }}
            // validationSchema={ContentItemFormSchema}
            onSubmit={(values, { setSubmitting }) => {
                let valuesToSubmit = {...values};

                delete valuesToSubmit.editorState;

                valuesToSubmit.text = stateToHTML(values.editorState.getCurrentContent());

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
                <form className="te-form te-content-item-form" onSubmit={handleSubmit}>
                    <div className="input-single">
                        <TextField name="order" label="Order"
                                   fullWidth
                                   value={values.order}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.order && touched.order}
                                   helperText={errors.order && touched.order ? errors.order : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <TextField name="videoUrl" label="Video URL"
                                   fullWidth
                                   value={values.videoUrl}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.videoUrl && touched.videoUrl}
                                   helperText={errors.videoUrl && touched.videoUrl ? errors.videoUrl : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <TextField name="videoTime" label="Video Time"
                                   fullWidth
                                   value={values.videoTime}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.videoTime && touched.videoTime}
                                   helperText={errors.videoTime && touched.videoTime ? errors.videoTime : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <TextField name="imageUrl" label="Image URL"
                                   fullWidth
                                   value={values.imageUrl}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.imageUrl && touched.imageUrl}
                                   helperText={errors.imageUrl && touched.imageUrl ? errors.imageUrl : ''}
                                   variant="outlined"
                        />
                    </div>
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
                        <RichTextEditor
                            name="text"
                            label="Text"
                            placeholder="Write here..."
                            editorState={values.editorState}
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
                        <Autocomplete
                            name="stakeholders"
                            options={stakeholders}
                            getOptionLabel={o => o.title}
                            defaultValue={values.stakeholders ? values.stakeholders[0] : null}
                            onChange={(_, value) => {
                                setFieldValue('stakeholders', [value.id]);
                            }}

                            renderInput={params =>
                                <TextField {...params}
                                           name="stakeholders"
                                           onBlur={handleBlur} onFocus={handleFocus}
                                           label="Stakeholder"
                                           error={!!errors.stakeholders && touched.stakeholders}
                                           helperText={errors.stakeholders && touched.stakeholders ? errors.stakeholders : ''}
                                           variant="outlined" />
                            }
                        />
                    </div>
                    <div className="input-single">
                        <Autocomplete
                            name="providers"
                            options={providers}
                            getOptionLabel={o => o.title}
                            defaultValue={values.providers ? values.providers[0] : null}
                            onChange={(_, value) => {
                                setFieldValue('providers', [value.id]);
                            }}

                            renderInput={params =>
                                <TextField {...params}
                                           name="providers"
                                           onBlur={handleBlur} onFocus={handleFocus}
                                           label="Provider"
                                           error={!!errors.providers && touched.providers}
                                           helperText={errors.providers && touched.providers ? errors.providers : ''}
                                           variant="outlined" />
                            }
                        />
                    </div>
                    <div className="input-single">
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.published}
                                        onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                        error={!!errors.slug && touched.slug}
                                        helperText={errors.slug && touched.slug ? errors.slug : ''}
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

const ContentItemFormSchema = Yup.object().shape({
    email: Yup.string().email('Email is not valid').required('Email is required'),
    password: Yup.string().required('Address is required'),
});

export default ContentItemForm;
