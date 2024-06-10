import {Avatar, Box, Card, CircularProgress, IconButton, Paper, Stack, TextField, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {getTelegramPreviewByInterlink} from "../../../api/apiCore";

const interlinkPattern = /^((https?:\/\/)?(telegram\.me|telegram\.dog|t\.me\/))?(((\+|joinchat\/)([\w-]+))|([a-zA-Z0-9_])){5,}$/;
const SearchChat = ({state, isLoading, setIsLoading}) => {

    const toCheck = () => {
        // because all checking begins from isLoading
        state.setIsChecked(true);
        if (typeof state.value !== 'string') { state.setError('link must be a string'); return;}
        const match = state.value.match(interlinkPattern);
        if (!match || !match[0]) { state.setError('Invalid value'); return;}
        
        setIsLoading(true)
        getTelegramPreviewByInterlink({ inputInterlink: state.value })
            .then((response) => {
                const data = response.data;
                data.preview && state.setPreview(data.preview);
                if(data.error) state.setError(data.message);
            })
            .catch((error) => {
                if(error && error.response && error.response.data) state.setError(error.response.data);
                else state.setError(error)
            })
            .finally(()=>{
                setIsLoading(false);
            })
    }
    const handleSearch = () => {
        if(isLoading) return;
        if(state.isChecked){
           state.clean();
           state.setValue('');
        } else {
            toCheck();
        }
    };
    const handleInputChange = (e) => {
        state.setValue(e.target.value.replace(/\s/g, ""));
        if(state.isChecked) state.clean();
    };
    const SearchButton = () => (
        <IconButton onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
                <CircularProgress size={20} />
            ) : state.isChecked ? (
                <CloseIcon />
            ) : (
                <SearchIcon />
            )}
        </IconButton>
    )
    const InterlinkPreview = () => {
        if(!state.preview) return null;
        return (
            <Card elevation={10}
              sx={{
                  p: 3,
                  textAlign:"center",
              }}
            >
                <Avatar
                    alt='Avatar'
                    src={state.preview.photoUrl}
                    sx={{
                        width: '122px',
                        height: '122px',
                        margin: 'auto'
                    }}
                />
                <Typography variant='h6'>{state.preview.title}</Typography>
                <Typography variant='subtitle1' gutterBottom>{state.preview.extra}</Typography>
                <Typography variant='body1'>{state.preview.description}</Typography>
            </Card>
        );
    }
    return (
        <Stack spacing={2}>
            <Card elevation={10}>
                <TextField
                    value={state.value}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    InputProps={{endAdornment: <SearchButton />}}
                    helperText={state.error}
                    error={state.error}
                    fullWidth
                    variant="outlined"
                    placeholder="telegram invite link"
                    size="small"
                />
            </Card>
            <InterlinkPreview />
        </Stack>
    );
}

export default SearchChat;