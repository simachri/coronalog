import React from 'react';
import {ReactComponent as AnalysisIcon} from "../assets/nav_analysis_icon.svg";
import {ReactComponent as InfoIcon} from "../assets/nav_info_icon.svg";
import {ReactComponent as UserIcon} from "../assets/nav_user_icon.svg";
import {ReactComponent as DashboardIcon} from "../assets/nav_dashboard_icon.svg";

export const NAV_BAR_AT = ['/', '/dashboard', '/info'];

export const NAV_ITEMS = [
    {
        title: 'Dashboard',
        link: '/dashboard',
        exact: true,
        svgIcon: <DashboardIcon />,
    },
    {
        title: 'Analysis',
        link: '/',
        exact: true,
        svgIcon: <AnalysisIcon />
    },
    {
        title: 'About Us',
        link: '/about-us',
        exact: true,
        svgIcon: <InfoIcon />,
    },
    {
        title: 'User',
        link: '/user-info',
        exact: true,
        svgIcon: <UserIcon />,
    }
];