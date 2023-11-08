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
                    backgroundColor: '#BB86FC',
                    maxHeight: '60px',
                    justifyContent: 'center',
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h5"
                        fontWeight={'bold'}
                        component="div"
                        sx={{ flexGrow: 1, color: 'white' }}
                    >
                        Tell
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon
                                sx={{ fontSize: 36, color: 'white' }}
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
