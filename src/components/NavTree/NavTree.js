import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeView from '@material-ui/lab/TreeView';
import NavTreeItem from "./NavTreeItem";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AppsIcon from '@material-ui/icons/Apps';
import BookIcon from '@material-ui/icons/Book';

const useTreeStyles = makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 300,
    },
});

const NavTree = () => {
    const treeClasses = useTreeStyles();


    return (
        <TreeView
            className={treeClasses.root}
            defaultExpanded={['3']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
        >
            <NavTreeItem nodeId="1" labelText="Landing Page" labelIcon={AccountBalanceIcon}>
                <NavTreeItem nodeId="2" labelText="Content Items" labelIcon={AppsIcon} itemLink="/content-items"/>
                <NavTreeItem nodeId="3" labelText="Providers" labelIcon={AppsIcon} itemLink="/providers"/>
                <NavTreeItem nodeId="4" labelText="Stakeholders" labelIcon={AppsIcon} itemLink="/stakeholders"/>
                <NavTreeItem nodeId="5" labelText="Tags" labelIcon={AppsIcon} itemLink="/tags"/>
                <NavTreeItem nodeId="6" labelText="Testimonies" labelIcon={AppsIcon} itemLink="/testimonies"/>
                <NavTreeItem nodeId="7" labelText="FAQs" labelIcon={AppsIcon} itemLink="/faqs"/>
            </NavTreeItem>
            <NavTreeItem nodeId="8" labelText="Blog" labelIcon={BookIcon}>
                <NavTreeItem nodeId="9" labelText="Articles" labelIcon={AppsIcon} itemLink="/articles"/>
            </NavTreeItem>
        </TreeView>
    )
};

export default NavTree;
