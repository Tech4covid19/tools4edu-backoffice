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
import {
    DASHBOARD_ACTIONS,
    dashboardInitialState,
    dashboardReducer,
    DashboardStateProvider,
    useDashboardState
} from "./DashboardState";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";

const drawerWidth = 250;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        toolBar: {
            display: 'flex'
        },
        leftInfo: {
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'baseline',
            fontSize: 16
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
            padding: 0,
            width: `calc(100% - ${drawerWidth}px)`
        },
    }),
);

const GET_STAKEHOLDERS = gql`
    query GetStakeholders {
        stakeholders {
            id,
            order,
            title
        }
    }
`;

const GET_PROVIDERS = gql`
    query GetProviders {
        providers {
            id,
            order,
            title
        }
    }
`;

const GET_TAGS = gql`
    query GetContentTags {
        contentTags {
            id,
            order,
            title
        }
    }
`;


const Dashboard = ({ match, authService, history }) => {
    const classes = useStyles();

    const { data: stakeholdersData, loading: stakeholdersLoading, error: stakeholdersError } = useQuery(GET_STAKEHOLDERS);
    const { data: providersData, loading: providersLoading, error: providersError } = useQuery(GET_PROVIDERS);
    const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_TAGS);

    const [{}, dashboardDispatch] = useDashboardState();

    React.useEffect(() => {
        if (!stakeholdersData) return;
        dashboardDispatch({
            type: DASHBOARD_ACTIONS.INIT_STAKEHOLDERS,
            payload: stakeholdersData.stakeholders
        })
    }, [stakeholdersData]);

    React.useEffect(() => {
        if (!providersData) return;
        dashboardDispatch({
            type: DASHBOARD_ACTIONS.INIT_PROVIDERS,
            payload: providersData.providers
        })
    }, [providersData]);

    React.useEffect(() => {
        if (!tagsData) return;
        dashboardDispatch({
            type: DASHBOARD_ACTIONS.INIT_TAGS,
            payload: tagsData.contentTags
        })
    }, [tagsData]);

    return (
        <div className={classes.root}>

            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolBar}>
                    <Typography variant="h6" noWrap>
                        Tools4Edu Backoffice
                    </Typography>
                    <div className="left-info" className={classes.leftInfo}>
                        <Typography variant="p">{localStorage.getItem('t4e-email')}</Typography>
                        <Button color="inherit" onClick={() => authService.logout(history)} className={classes.logoutBtn}>Logout</Button>
                    </div>
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
