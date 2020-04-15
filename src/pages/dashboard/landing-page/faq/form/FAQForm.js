import React from 'react';
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
    question: '',
    answer: '',
    published: false,
    stakeholder: '',
    provider: '',
};

const FAQForm = ({ initialValues = defaultInitialValues, onSubmit, onCancel, actionLabel }) => {
    const [{ stakeholders, providers }] = useDashboardState();

    const blocksFromHTML = convertFromHTML(initialValues ? initialValues.answer : '');

    return (
        <Formik
            initialValues={{
                ...initialValues,
                editorState: initialValues && initialValues.answer !== '' ?
                    new EditorState.createWithContent(ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap
                    )) :
                    new EditorState.createEmpty()
            }}
            validationSchema={FAQFormSchema}
            onSubmit={(values, { setSubmitting }) => {


                let valuesToSubmit = {...values};

                delete valuesToSubmit.id;
                delete valuesToSubmit.createdAt;
                delete valuesToSubmit.updatedAt;
                delete valuesToSubmit.__typename;

                delete valuesToSubmit.editorState;
                delete valuesToSubmit.provider;
                delete valuesToSubmit.stakeholder;

                valuesToSubmit.answer = stateToHTML(values.editorState.getCurrentContent());

                valuesToSubmit.providerId = values.provider ? values.provider.id : null;
                valuesToSubmit.stakeholderId = values.stakeholders ? values.stakeholders.map(s => s.id) : null;

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
                        <TextField name="question" label="Question"
                                   fullWidth
                                   value={values.question}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.question && touched.question}
                                   helperText={errors.question && touched.question ? errors.question : ''}
                                   variant="outlined"
                        />
                    </div>
                    <div className="input-single">
                        <RichTextEditor
                            name="answer"
                            label="Answer"
                            placeholder="Write here..."
                            editorState={values.editorState}
                            onChange={setFieldValue}
                            onBlur={handleBlur} onFocus={handleFocus}
                        />
                    </div>

                    <div className="input-single">
                        <Autocomplete
                            name="stakeholder"
                            options={stakeholders}
                            getOptionLabel={o => o.title}
                            value={values.stakeholder ? values.stakeholder : null}
                            onChange={(_, value) => {
                                setFieldValue('stakeholder', value);
                            }}

                            renderInput={params =>
                                <TextField {...params}
                                           name="stakeholder"
                                           onBlur={handleBlur} onFocus={handleFocus}
                                           label="Stakeholder"
                                           error={!!errors.stakeholder && touched.stakeholder}
                                           helperText={errors.stakeholder && touched.stakeholder ? errors.stakeholder : ''}
                                           variant="outlined" />
                            }
                        />
                    </div>
                    <div className="input-single">
                        <Autocomplete
                            name="provider"
                            options={providers}
                            getOptionLabel={o => o.title}
                            value={values.provider ? values.provider : null}
                            onChange={(_, value) => {
                                setFieldValue('provider', value);
                            }}

                            renderInput={params =>
                                <TextField {...params}
                                           name="provider"
                                           onBlur={handleBlur} onFocus={handleFocus}
                                           label="Provider"
                                           error={!!errors.provider && touched.provider}
                                           helperText={errors.provider && touched.provider ? errors.provider : ''}
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

const FAQFormSchema = Yup.object().shape({
    question: Yup.string().required('Question is required')
});

export default FAQForm;
