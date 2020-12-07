import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReconnectingWebSocket from "reconnecting-websocket";
import {getActiveUsers} from "../../store/actions/usersActions";
import {
    makeStyles,
    CssBaseline,
    Container,
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import FormElement from "../../components/UI/FormElement/FormElement";
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: theme.spacing(4)
    },
    gridItem: {
        marginRight: '30px',
    },
    chatGrid: {
        flexGrow: 1,
        padding: theme.spacing(3),
        boxShadow: '0 0 3px 1px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        height: '500px',
        flexDirection: 'column',
    },
    messagesGrid: {
        height: '350px',
        overflow: 'scroll',
        flexGrow: 1,
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid #000',
        paddingTop: theme.spacing(3)
    },
    btn: {
        marginLeft: '20px'
    },
    chatInput: {
        marginBottom: '0'
    },
    messages: {

    }
}));

const Chat = () => {
    const classes = useStyles();
    const {users, user, usersError} = useSelector(state => state.users);
    const [state, setState] = useState({
        messages: [],
        newMessage: ''
    });
    const dispatch = useDispatch();
    const ws = useRef(null);
    const scrollElem = useRef(null);

    useEffect(() => {
        ws.current = new ReconnectingWebSocket(`ws://localhost:8000/chat?token=${user.token}`);
        ws.current.onclose = () => console.log('ws connection closed');
        ws.current.onmessage = e => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case 'LAST_MESSAGES':
                    setState(prevState => ({
                        ...prevState,
                        messages: data.messages
                    }));
                    break;
                case 'ACTIVE_USERS':
                    dispatch(getActiveUsers(data.activeUsers));
                    break;
                case 'NEW_MESSAGE':
                    setState(prevState => ({
                        ...prevState,
                        messages: [...prevState.messages, data.message]
                    }));
                    break;
                default:
                    console.log('No data');
                    break;
            }
        }
        return () => ws.current.close();
    }, [dispatch, user.token]);

    const onSubmitForm = e => {
        e.preventDefault();
        ws.current.send(JSON.stringify({
            type: 'CREATE_MESSAGE',
            message: state.newMessage
        }));
        setState(prevState => ({
            ...prevState,
            newMessage: ''
        }));
        scrollBottom();
    };

    const scrollBottom = () => {
        scrollElem.current.scrollIntoView({block: 'end', behavior: 'smooth'});
    }

    useEffect(scrollBottom, [state.messages]);

    const onChangeField = e => {
        const name = e.target.name;
        const value = e.target.value;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <CssBaseline />
            <Container>
                <Typography
                    variant='h5'
                    component='h5'
                    align='center'
                    className={classes.title}
                >
                    Chat
                </Typography>
                <Grid
                    container
                    direction='row'
                >
                    <Grid
                        item
                        className={classes.gridItem}
                    >
                        <Typography variant='h6' component='h6'>
                            Пользователи
                        </Typography>
                        {!usersError ? <List dense>
                            {users && Object.keys(users).map(user => <ListItem
                                key={users[user]}
                            >
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={users[user]}
                                />
                            </ListItem>)}
                        </List> : <p style={{textAlign: 'center'}}>{usersError}</p>}
                    </Grid>
                    <Grid
                        item
                        className={classes.chatGrid}
                    >
                        <Grid item className={classes.messagesGrid}>
                            <List dense className={classes.messages}>
                                {state.messages.length !== 0 && state.messages.map(message => <ListItem
                                    key={message._id}
                                >
                                    <ListItemText primary={message.user.username + ': ' + message.message}/>
                                </ListItem>)}
                            </List>
                            <div ref={scrollElem} />
                        </Grid>
                        <form
                            onSubmit={e => onSubmitForm(e)}
                            className={classes.form}
                        >
                            <FormElement
                                label='Новое сообщение'
                                changed={e => onChangeField(e)}
                                value={state.newMessage}
                                name='newMessage'
                                type='text'
                                classNameInput={classes.chatInput}
                            />
                            <Button
                                type='submit'
                                color='primary'
                                variant='contained'
                                className={classes.btn}
                            >
                                Отправить
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Chat;