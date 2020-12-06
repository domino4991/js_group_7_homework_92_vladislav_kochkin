import React from 'react';
import {Button, makeStyles} from '@material-ui/core';
import {NavLink} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    items: {
        marginLeft: theme.spacing(2)
    }
}))

const AnonMenu = () => {
    const classes = useStyles();
    return (
        <>
            <Button
                component={NavLink}
                to="/register"
                color="inherit"
                className={classes.items}
            >Register</Button>
            <Button
                component={NavLink}
                to="/login"
                color="inherit"
                className={classes.items}
            >Login</Button>
        </>
    );
};

export default AnonMenu;