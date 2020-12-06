import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {cleanUsersErrors, loginUser, registerUser} from "../../store/actions/usersActions";
import {makeStyles, CssBaseline, Container, Grid, Button, Typography} from "@material-ui/core";
import FormElement from "../../components/UI/FormElement/FormElement";

const useStyles = makeStyles(theme => ({
    form: {
        width: '300px',
        margin: '0 auto'
    },
    title: {
        marginBottom: theme.spacing(4)

    }
}));

const LoginRegister = (props) => {
    const classes = useStyles();
    const {usersError} = useSelector(state => state.users);
    const dispatch = useDispatch();
    const url = props.match.url;
    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        dispatch(cleanUsersErrors());
    }, [dispatch, url]);

    const onChangeField = e => {
        const name = e.target.name;
        const value = e.target.value;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const getFieldError = fieldName => {
        try {
            return usersError.errors[fieldName].message;
        } catch (e) {
            return null;
        }
    };

    const onSubmittedForm = e => {
        e.preventDefault();
        if(url === '/register') {
            dispatch(registerUser(user));
        } else if(url === '/login') {
            dispatch(loginUser(user));
        }
        setUser({
            username: '',
            password: ''
        });
    };

    return (
        <>
            <CssBaseline />
            <Container>
                <Grid container direction='column'>
                    <Typography
                        variant='h5'
                        component='h5'
                        align='center'
                        className={classes.title}
                    >
                        {url === '/register' ? 'Регистрация' : 'Вход'}
                    </Typography>
                    <form
                        className={classes.form}
                        onSubmit={e => onSubmittedForm(e)}
                    >
                        <FormElement
                            label='Логин'
                            error={getFieldError('username')}
                            changed={e => onChangeField(e)}
                            value={user.username}
                            name='username'
                            type='text'
                        />
                        <FormElement
                            label='Пароль'
                            error={getFieldError('password')}
                            changed={e => onChangeField(e)}
                            value={user.password}
                            name='password'
                            type='password'
                        />
                        <Button
                            variant='contained'
                            type='submit'
                            fullWidth
                            color='primary'
                        >
                            {url === '/register' ? 'Регистрация' : 'Вход'}
                        </Button>
                    </form>
                </Grid>
                <ToastContainer autoClose={3000} />
            </Container>
        </>
    );
};

export default LoginRegister;