import {ErrorOutline, TaskAlt} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";

const Submitted = ({postError}) => {
    const successMessage='';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '80%'}}>
            {postError ? (
                <>
                    <ErrorOutline sx={{ fontSize: 150, color: 'red' }} />
                    <Typography sx={{
                        textAlign: 'center',
                        color: 'rgba(197,190,190,0.91)'
                    }}>
                        {postError.message &&
                            (<Typography variant="body1">{postError.message}</Typography>)
                        }
                        {postError.response && (typeof postError.response.data === 'string') &&
                            (<Typography variant="body1">{postError.response.data}</Typography>)
                        }
                    </Typography>
                </>
            ) : (
                <>

                    <TaskAlt sx={{ fontSize: 150, color: 'green' }} />
                    <Typography sx={{
                        textAlign: 'center',
                        color: 'rgba(197,190,190,0.91)'
                    }}>
                        <Typography variant="body1" >{successMessage}</Typography>
                    </Typography>
                </>
            )}
        </Box>
    )
}

export default Submitted