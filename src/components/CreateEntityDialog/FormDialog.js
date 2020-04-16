import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ title, open, onRequestCancel, onRequestSubmit, formComponent }) {
    return (
        <Dialog open={open} aria-labelledby="te-create-entity-dialog-title">
            <DialogTitle id="te-create-entity-dialog-title">{title}</DialogTitle>
            <DialogContent>
                { formComponent }
            </DialogContent>
        </Dialog>
    )
}
