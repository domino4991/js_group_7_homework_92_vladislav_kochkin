import React, {useState} from 'react';
import {Button, Menu, MenuItem} from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../store/actions/usersActions";

const UserMenu = () => {
    const {user} = useSelector(state => state.users);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                color='inherit'
                onClick={e => setAnchorEl(e.currentTarget)}
            >
                Hello, {user && user.username}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={() => dispatch(logoutUser())}
                >
                    Выход
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;