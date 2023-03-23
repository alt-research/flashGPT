import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import {
  Avatar,
  Box,
  Button,
  Divider, Link, Popover,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
      & > .MuiSvgIcon-root: {
        color: #1c1c1f;
      }
      padding-left: 0.5rem;
      padding-right: 0.5rem;
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: #1c1c1f;
        padding: 1rem;
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: 0.5rem;
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        white-space: nowrap;
        font-weight: 700;
        color: white;
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: white;
`
);

function HeaderUserbox() {
  const { logout, user } = useAuthContext();

  const handleClickSignOut = () => {
    logout({ returnTo: window.location.origin });
  };

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = ()=> {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <UserBoxButton
        color="secondary"
        fullWidth
        onClick={handleOpen}
        ref={ref}
        sx={{ px: { xs: 0, md: 3 } }}
      >
        <Avatar
          alt={user?.name}
          src={user?.picture}
          sx={{ width: '24px', height: '24px' }}
          variant="rounded"
        />
    
      
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
        open={isOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx:{
            "&&": {bgcolor: "#1c1c1f"}
          }
        }}
      >
        <MenuUserBox display="flex" sx={{ minWidth: 210 }}>
          <Avatar alt={user?.name} src={user?.picture} variant="rounded" />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user?.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">{user?.email}</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleClickSignOut} sx={{bgcolor: "#1c1c5f"}}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            <Link component={NavLink} to="/generate" variant="body1">
              Sign out
            </Link>
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
