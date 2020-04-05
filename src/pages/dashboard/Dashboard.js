import React from 'react';
import './Dashboard.scss';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NavTree from "../../components/NavTree/NavTree";
import { Switch, Route, withRouter } from 'react-router';
import ContentItemPage from "./landing-page/content-item/ContentItemPage";
import FAQPage from "./landing-page/faq/FAQPage";
import ProviderPage from "./landing-page/provider/ProviderPage";
import StakeholderPage from "./landing-page/stakeholder/StakeholderPage";
import TagPage from "./landing-page/tag/TagPage";
import TestimonyPage from "./landing-page/testimony/TestimonyPage";
import ArticlePage from "./blog/article/ArticlePage";

const drawerWidth = 400;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
            height: '100vh'
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

const Dashboard = ({ match }) => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Tools4Edu Backoffice
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <NavTree/>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                <Switch>
                    <Route path={match.url + "content-items"} component={ContentItemPage}/>
                    <Route path={match.url + "faqs"} component={FAQPage}/>
                    <Route path={match.url + "providers"} component={ProviderPage}/>
                    <Route path={match.url + "stakeholders"} component={StakeholderPage}/>
                    <Route path={match.url + "tags"} component={TagPage}/>
                    <Route path={match.url + "testimonies"} component={TestimonyPage}/>
                    <Route path={match.url + "articles"} component={ArticlePage}/>
                </Switch>
            </main>
        </div>
    )
};

export default withRouter(Dashboard);
