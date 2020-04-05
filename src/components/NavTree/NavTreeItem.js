import React from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core/styles";

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
        overflow: 'hidden'
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

const NavTreeItem = ({ labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other }) => {
    const treeItemClasses = useTreeItemStyles();

    return (
        <TreeItem
            label={
                <div className={treeItemClasses.labelRoot}>
                    <LabelIcon color="inherit" className={treeItemClasses.labelIcon} />
                    <Typography variant="body2" className={treeItemClasses.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: treeItemClasses.root,
                content: treeItemClasses.content,
                expanded: treeItemClasses.expanded,
                selected: treeItemClasses.selected,
                group: treeItemClasses.group,
                label: treeItemClasses.label,
            }}
            {...other}
        />
    )
};

export default NavTreeItem;
