import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Formik} from "formik";
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Alert from "@material-ui/lab/Alert";

import Auth from '../../auth';
import {withRouter} from "react-router";
import {DASHBOARD_ACTIONS, useDashboardState} from "../dashboard/DashboardState";
import Dialog from "@material-ui/core/Dialog";
import FormDialog from "../../components/FormDialog/FormDialog";
import NewPasswordForm from "./form/NewPasswordForm";

const auth = new Auth();

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(user: {
            email: $email, password: $password   
        }) {
            email,
            accessToken,
            refreshToken,
            needPasswordChange
        }
    }
`;

const SET_NEW_PASSWORD_MUTATION = gql`
    mutation SetNewPassword($email: String!, $newPassword: String!, $oldPassword: String!) {
        completeNewPasswordChallenge(user: {
            email: $email,
            newPassword: $newPassword,
            oldPassword: $oldPassword
        }) {
            email,
            accessToken,
            refreshToken,
            needPasswordChange
        }
    }
`;

function LoginPage({ history }) {
    const classes = useStyles();

    const [isNeedNewPasswordOpened, setNewPasswordOpened] = React.useState(false);
    const [currentUserData, setCurrentUserData] = React.useState(null);

    const [login, { loading: loginLoading, error: loginError, data: loginData }] = useMutation(LOGIN_MUTATION);
    const [setNewPassword, { loading: newPwdLoading, error: newPwdError, data: newPwdData}] = useMutation(SET_NEW_PASSWORD_MUTATION);

    const handleSubmit = (values, { setSubmitting, setStatus, resetForm }) => {
        console.log('submit values', values);
        login({ variables: {
            email: values.email,
            password: values.password
        }}).then(({ data }) => {
            if (data.login.needPasswordChange) {
                console.log('needs pass change', data);
                //TODO: Open password change modal
                setCurrentUserData({
                    email: values.email,
                    password: values.password
                });
                setNewPasswordOpened(true);
                return;
            }
            auth.login(data.login, history);
            setSubmitting(false);
        }).catch(err => {
            if (JSON.stringify(err).includes('NotAuthorizedException')) {
                setStatus({msg: 'Incorrect email or password'});
            }
            setSubmitting(false);
        });

    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validationSchema={LoginFormSchema}
                    onSubmit={handleSubmit}
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
                          isSubmitting
                      }) => (
                        <form className={classes.form} noValidate onSubmit={handleSubmit}>
                            {status && status.msg && <Alert severity="error">{ status.msg }</Alert>}


                            <TextField
                                value={values.email}
                                onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                error={!!errors.email && touched.email}
                                helperText={errors.email && touched.email ? errors.email : ''}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                value={values.password}
                                onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                                error={!!errors.password && touched.password}
                                helperText={errors.password && touched.password ? errors.password : ''}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                Sign In
                            </Button>
                        </form>
                      )}
                </Formik>
            </div>
            <FormDialog
                open={isNeedNewPasswordOpened}
                title={'Set a password'}
                formComponent={
                    <NewPasswordForm
                        actionLabel={'Submit'}
                        onSubmit={(values) => {
                            setNewPassword({ variables: {
                                email: currentUserData.email,
                                oldPassword: currentUserData.password,
                                newPassword: values.password
                            }})
                                .then((result) => {
                                    console.log('result new password', result.data);
                                    auth.login(result.data.completeNewPasswordChallenge, history);
                                })
                                .catch(err => {
                                    console.log('err new password', err);
                                })
                        }}
                    />
                }
            />
        </Container>
    );
}

export default withRouter(LoginPage);

const LoginFormSchema = Yup.object().shape({
    email: Yup.string().email('Email is not valid').required('Email is required'),
    password: Yup.string().required('Address is required'),
});
