import { styled, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

import IconAltlayerLong from './IconAltlayerLong';
import IconAltlayerSmall from './IconAltlayerSmall';

const AltlayerLogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);


const AltlayerLogo = ({ size = 'small', sx, ...rest }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <AltlayerLogoWrapper
      sx={{ color: 'primary.light', width: { sm: size === 'small' ? 187 : 346, xs: 0 }, ...sx }}
      to="/"
      {...rest}
    >
      {sm ? (
        <IconAltlayerLong
          height={size === 'small' ? 32 : 60}
          width={size === 'small' ? 187 : 346}
        />
      ) : (
        <IconAltlayerSmall />
      )}
    </AltlayerLogoWrapper>
  );
};

export default AltlayerLogo;
