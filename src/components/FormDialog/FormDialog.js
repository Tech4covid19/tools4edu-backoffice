import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import './FormDialog.scss';

export default function FormDialog({ title, open, onRequestCancel, onRequestSubmit, formComponent }) {
    return (
        <Dialog open={open} aria-labelledby="te-form-dialog-title" maxWidth="md">
            <DialogTitle id="te-form-dialog-title">
                <span>{title}</span>
                <CloseIcon onClick={() => onRequestCancel()}/>
            </DialogTitle>
            <DialogContent dividers={true}>
                { formComponent }
            </DialogContent>
        </Dialog>
    )
}
