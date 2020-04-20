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
    order: 0,
    type: '',
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
    const [{ stakeholders, providers, tags }] = useDashboardState();

    const blocksFromHTML = convertFromHTML(initialValues ? initialValues.text : '');

    const [formType, setFormType] = React.useState(null)

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
            validationSchema={ContentItemFormSchema}
            onSubmit={(values, { setSubmitting }) => {


                let valuesToSubmit = {...values};

                delete valuesToSubmit.id;
                delete valuesToSubmit.createdAt;
                delete valuesToSubmit.updatedAt;
                delete valuesToSubmit.__typename;

                delete valuesToSubmit.editorState;
                delete valuesToSubmit.providers;
                delete valuesToSubmit.stakeholders;
                delete valuesToSubmit.tags;

                valuesToSubmit.text = stateToHTML(values.editorState.getCurrentContent());

                valuesToSubmit.providerIds = values.providers ? values.providers.map(p => p.id) : [];
                valuesToSubmit.stakeholderIds = values.stakeholders ? values.stakeholders.map(s => s.id) : [];
                valuesToSubmit.tagIds = values.tags ? values.tags.map(t => t.id) : [];

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
                        <Autocomplete
                            name="type"
                            options={[{ name: 'Artigo', value: 'CONTENT-ARTICLE' }, { name: 'Video', value: 'CONTENT-TUTORIAL-VIDEO'}]}
                            getOptionLabel={o => o.name}
                            getOptionSelected={o => o.value}
                            value={values.type ?
                                (
                                    values.type === 'CONTENT-ARTICLE' ? { name: 'Artigo', value: 'CONTENT-ARTICLE'} : (
                                        values.type === 'CONTENT-TUTORIAL-VIDEO' ? { name: 'Video', value: 'CONTENT-TUTORIAL-VIDEO'} : null
                                    )
                                )
                                : null}
                            onChange={(_, value) => {
                                setFieldValue('type', value.value);
                            }}

                            renderInput={params =>
                                <TextField {...params}
                                           name="type"
                                           onBlur={handleBlur} onFocus={handleFocus}
                                           label="Type"
                                           variant="outlined" />
                            }
                        />
                    </div>
                    <div className="input-single">
                        <TextField name="order" label="Order"
                                   type="number"
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
                            editorStateName="editorState"
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
                            value={values.stakeholders ? values.stakeholders[0] : null}
                            onChange={(_, value) => {
                                setFieldValue('stakeholders', [value]);
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
                            value={values.providers ? values.providers[0] : null}
                            onChange={(_, value) => {
                                setFieldValue('providers', [value]);
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
                        <Autocomplete
                            name="tags"
                            options={tags}
                            getOptionLabel={o => o.title}
                            value={values.tags ? values.tags[0] : null}
                            onChange={(_, value) => {
                                setFieldValue('tags', [value]);
                            }}

                            renderInput={params =>
                                <TextField {...params}
                                           name="tags"
                                           onBlur={handleBlur} onFocus={handleFocus}
                                           label="Tag"
                                           error={!!errors.tags && touched.tags}
                                           helperText={errors.tags && touched.tags ? errors.tags : ''}
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
    title: Yup.string().required('Title is required')
});

export default ContentItemForm;
