import { Box, Grid, Typography } from '@mui/material';


const StepHeader = ({
    title,
    step,
    sx,
    ...rest
  }) => (
    <Grid container justifyContent="space-between" py={1} sx={{ ...sx }} {...rest}>
      <Grid
        alignItems="center"
        container
        item
        sx={{
          '& svg': {
            width: '20px',
            height: '20px',
          },
        }}
        xs={6}
      >
        <Box
          sx={{
            display: 'inline-block',
            height: 20,
            width: 20,
            mr: 1,
          }}
        >
            <Typography
              sx={{
                bgcolor: '#333',
                borderRadius: '50%',
                textAlign: 'center',
                mr: 1,
                height: 20,
                width: 20,
              }}
            >
              {step}
            </Typography>
          
        </Box>
        <Grid item>
          <Typography component="span" variant="h5">
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  export default StepHeader