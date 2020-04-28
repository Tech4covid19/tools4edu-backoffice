import React from 'react';
import {Formik} from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import {useDashboardState} from "../../../DashboardState";
import CustomTextEditor from "../../../../../components/CustomTextEditor/CustomTextEditor";

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

    return (
        <Formik
            initialValues={{
                ...initialValues,
            }}
            onSubmit={(values, { setSubmitting }) => {


                let valuesToSubmit = {...values};

                delete valuesToSubmit.id;
                delete valuesToSubmit.createdAt;
                delete valuesToSubmit.updatedAt;
                delete valuesToSubmit.__typename;

                delete valuesToSubmit.provider;
                delete valuesToSubmit.stakeholder;

                valuesToSubmit.providerId = values.provider ? values.provider.id : null;
                valuesToSubmit.stakeholderId = values.stakeholder ? values.stakeholder.id : null;

                console.log(valuesToSubmit.providerId)

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
                        <CustomTextEditor
                            label="Question"
                            placeholder="Write here"
                            htmlContent={values.question}
                            onContentChange={(value) => setFieldValue('question', value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>
                    <div className="input-single">
                        <CustomTextEditor
                            label="Answer"
                            placeholder="Write here"
                            htmlContent={values.answer}
                            onContentChange={(value) => setFieldValue('answer', value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
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
                                console.log('changed prov', value);
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

export default FAQForm;
