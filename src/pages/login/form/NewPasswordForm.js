import React from 'react';
import {Formik} from "formik";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as Yup from "yup";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const defaultInitialValues = {
    password: '',
    confirmPassword: ''
};

const NewPasswordForm = ({ initialValues = defaultInitialValues, onSubmit, onCancel, actionLabel }) => {

    const [ showPassword, setShowPassword ] = React.useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = React.useState(false);

    return (
        <Formik
            initialValues={{
                ...initialValues
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                onSubmit(values)
            }}
            validationSchema={NewPasswordFormSchema}
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
                <form className="te-form te-new-password-form" onSubmit={handleSubmit}>
                    <div className="input-single">
                        <TextField name="password" label="Password"
                                   fullWidth
                                   type={showPassword ? 'text' : 'password'}
                                   value={values.password}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.password && touched.password}
                                   helperText={errors.password && touched.password ? errors.password : ''}
                                   variant="outlined"
                                   endAdornment={
                                       <InputAdornment position="end">
                                           <IconButton
                                               aria-label="toggle password visibility"
                                               onClick={() => setShowPassword( !showPassword )}
                                           >
                                               {showPassword ? <Visibility /> : <VisibilityOff />}
                                           </IconButton>
                                       </InputAdornment>
                                   }
                        />
                    </div>
                    <div className="input-single">
                        <TextField name="confirmPassword" label="Confirm Password"
                                   fullWidth
                                   type={showConfirmPassword ? 'text' : 'password'}
                                   value={values.confirmPassword}
                                   onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                   error={!!errors.confirmPassword && touched.confirmPassword}
                                   helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                                   variant="outlined"
                                   endAdornment={
                                       <InputAdornment position="end">
                                           <IconButton
                                               aria-label="toggle password visibility"
                                               onClick={() => setShowConfirmPassword( !showConfirmPassword )}
                                           >
                                               {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                           </IconButton>
                                       </InputAdornment>
                                   }
                        />
                    </div>
                    <div className="form-actions">
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            type="submit"
                            disabled={isSubmitting}
                        >
                            { actionLabel }
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    )
};

const NewPasswordFormSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export default NewPasswordForm;
