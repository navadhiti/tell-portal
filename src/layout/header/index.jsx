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
                    maxHeight: '70px',
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
                        <span style={{ color: '#034EA1', letterSpacing: '1px' }}>Tel</span>
                        <span style={{ color: '#EC1C24', letterSpacing: '1px' }}>l</span>
                        <br />
                        <div style={{ fontSize: '17px' }}>
                            <span style={{ color: '#034EA1', letterSpacing: '1px' }}>
                                "Speak like{' '}
                            </span>
                            <span style={{ color: '#EC1C24', letterSpacing: '1px' }}>me ..."</span>
                            <span style={{ color: '#034EA1', letterSpacing: '1px' }}>
                                "Speak with{' '}
                            </span>
                            <span style={{ color: '#EC1C24', letterSpacing: '1px' }}>me ..."</span>
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
