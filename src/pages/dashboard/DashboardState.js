import React, { createContext, useContext, useReducer } from 'react';

export const DashboardStateContext = createContext();

export const DashboardStateProvider = ({ reducer, initialState, children}) => (
    <DashboardStateContext.Provider value={useReducer(reducer, initialState)}>
        { children }
    </DashboardStateContext.Provider>
);

export const useDashboardState = () => useContext(DashboardStateContext);

export const dashboardInitialState = {
    stakeholders: [],
    providers: [],
    tags: []
};

export const DASHBOARD_ACTIONS = {
    INIT_STAKEHOLDERS: 'INIT_STAKEHOLDERS',
    ADD_STAKEHOLDER: 'ADD_STAKEHOLDER',
    REMOVE_STAKEHOLDER: 'REMOVE_STAKEHOLDER',
    INIT_PROVIDERS: 'INIT_PROVIDERS',
    ADD_PROVIDER: 'ADD_PROVIDER',
    REMOVE_PROVIDER: 'REMOVE_PROVIDER',
    INIT_TAGS: 'INIT_TAGS',
    ADD_TAG: 'ADD_TAG',
    REMOVE_TAG: 'REMOVE_TAG'
};

export const dashboardReducer = ( state, action ) => {
    switch (action.type) {
        case DASHBOARD_ACTIONS.INIT_STAKEHOLDERS:
            return {
                ...state,
                stakeholders: action.payload
            };

        case DASHBOARD_ACTIONS.INIT_PROVIDERS:
            return {
                ...state,
                providers: action.payload
            };

        case DASHBOARD_ACTIONS.INIT_TAGS:
            return {
                ...state,
                tags: action.payload
            };

        default:
            return state;
    }
};
