import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { Typography, styled } from '@mui/material';
import { ROLE_PT_BR } from '@/types/roles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';




const StyledUser = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifySelf: 'flex-end',
  paddingLeft: 15,
  ...theme.mixins.toolbar
}));

const FadeMenu = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push('/')

    signOut();
  }

  const navigateMyEvents = () => {
    router.push('/myEvents')
    
  }

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {open ? <ArrowDropDownIcon sx={{ color: '#006D3E', fontSize: 48 }} /> : <ArrowDropUpIcon sx={{ color: '#006D3E', fontSize: 48 }} />}

      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={navigateMyEvents} >
          <EventIcon
            sx={{ marginRight: 2 }}
          />
          <Typography>
            Meus eventos
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon
            sx={{ marginRight: 2 }} />
          <Typography>
            Sair

          </Typography>

        </MenuItem>
      </Menu>
    </div>
  );
}


const User = (props: { user: any }) => {
  const { user } = props;

  return (
    <StyledUser>
      <div className="bg-primary w-10 h-10 rounded-full flex justify-center items-center mr-2">
        <PersonIcon sx={{ color: '#FFFF' }} />
      </div>
      <div>
        <p className="text-primary font-bold">{user?.name}</p>
        <p className="text-primary font-light">{ROLE_PT_BR[user?.role as keyof typeof ROLE_PT_BR]}</p>
      </div>

      <FadeMenu />
    </StyledUser>
  )
}

export default User