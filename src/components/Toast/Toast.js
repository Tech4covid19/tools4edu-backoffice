import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Toast = ({ open, onRequestClose, type, text }) => {
    if (!open) return null;

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onRequestClose}>
            <Alert onClose={onRequestClose} severity={type || ''}>
                { text || '' }
            </Alert>
        </Snackbar>
    )
};

export default Toast;
