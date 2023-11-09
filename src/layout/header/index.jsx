import React from 'react';
import {
    AppBar,
    Box,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
inside;
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1, mb: '60px' }}>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: '#FFFFFF',
                    maxHeight: '60px',
                    justifyContent: 'center',
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h5"
                        fontWeight={'800'}
                        component="div"
                        sx={{ flexGrow: 1, color: '#034EA1' }}
                    >
                        <span style={{ color: '#034EA1' }}>Tel</span>
                        <span style={{ color: '#EC1C24' }}>l</span>
                        <br />
                        <div style={{ fontSize: '14px' }}>
                            <span style={{ color: '#034EA1' }}>
                                "Speak like{' '}
                            </span>
                            <span style={{ color: '#EC1C24' }}>me ..."</span>
                            <span style={{ color: '#034EA1' }}>
                                "Speak with{' '}
                            </span>
                            <span style={{ color: '#EC1C24' }}>me ..."</span>
                        </div>
                    </Typography>

                    <div>
                        <IconButton
                            size="large"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon
                                sx={{ fontSize: 36, color: '#034EA1' }}
                            />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/');
                                }}
                            >
                                <ListItemIcon>
                                    <ExitToAppIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
