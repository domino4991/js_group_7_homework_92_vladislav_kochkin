import React from 'react';
import {CssBaseline, Container, Typography, Button, makeStyles} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

const useStyles = makeStyles(() => ({
    plugContainer: {
        textAlign: 'center'
    }
}));

const PlugPage = () => {
    const classes = useStyles();
    const {user} = useSelector(state => state.users);
    return (
        <>
            <CssBaseline />
            <Container className={classes.plugContainer}>
                <Typography
                    variant='h4'
                    component='h4'
                    gutterBottom
                >
                    Чтобы войти в чат вам нужно зарегистрироваться или войти в аккаунт
                </Typography>
                <Button
                    component={NavLink}
                    to='/chat'
                    disabled={!user}
                    variant="contained"
                    color='primary'
                >
                    Войти в чат
                </Button>
            </Container>
        </>
    );
};

export default PlugPage;