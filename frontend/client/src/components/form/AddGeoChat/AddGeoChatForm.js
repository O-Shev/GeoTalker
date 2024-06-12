import {useEffect, useRef, useState} from "react";      //https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley
import SearchChat from "./SearchChat";
import ChooseLocality from "./ChooseLocality";
import Review from "./Review";
import {
    Box,
    Button,
    Grid,
    Step,
    StepLabel,
    Stepper,
} from "@mui/material";
import Submitted from "./Submitted";
import {LoadingButton} from "@mui/lab";
import {useMap} from "../../../context/MapboxContext";
import { useNavigate } from 'react-router-dom';
import {useBreakpointFeature} from "../../../context/BreakpointFeatureContext";
import {postGeoChat} from "../../../api/apiCore";

const steps = ['search chat', 'choose locality', 'review and submit']; // + submited
const AddGeoChatForm = () =>{
    const navigate = useNavigate();
    const close = ()=> {
        navigate('/');
    }

    const [activeStep, setActiveStep] = useState(0);
    const [postError, setPostError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const useInputState = () => {
        const [value, setValue] = useState('');
        const [preview, setPreview] = useState(null);
        const [isChecked, setIsChecked] = useState(false);
        const [error, setError] = useState(null);
        const [inputValue, setInputValue] = useState(''); //for locality only

        const clean = () => {
            setPreview(null);
            setError(null);
            setIsChecked(false);
            setInputValue('');
        }

        return {value, setValue, preview, setPreview, isChecked, setIsChecked, error, setError, inputValue, setInputValue, clean};
    }
    const interlink = useInputState();
    const locality = useInputState();

    const toPostForm = () => {
        setIsLoading(true);
        postGeoChat({
            interlink: interlink.value,
            osm: locality.value.osm
        }).then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
                setPostError(error);
            })
            .finally(() => {
                setIsLoading(false);
                setActiveStep((prevStep) => prevStep + 1)
            });
    }
    const toCleanForm = ()=>{
        interlink.clean();
        locality.clean();
        interlink.setValue('');
        locality.setValue(null);
        setActiveStep(0);
    }
    const formContent = () => {
        switch(activeStep) {
            case 0:
                return <SearchChat state={interlink} setIsLoading={setIsLoading} isLoading={isLoading}/>;
            case 1:
                return <ChooseLocality state={locality} setIsLoading={setIsLoading} isLoading={isLoading}/>;
            case 2:
                return <Review {...{interlink, locality}}/>;
            case 3:
                return <Submitted postError={postError}/>;
            default:
                return <div>404: Not Found</div>
        }
    };
    const backButtonContent = () => {
        switch(activeStep) {
            case 0:
                return "cancel";
            case 1:
                return "back";
            case 2:
                return "back";
            case 3:
                return "finish";
        }
    }
    const nextButtonContent = () => {
        switch(activeStep) {
            case 0:
                return "next";
            case 1:
                return "next";
            case 2:
                return "submit";
            case 3:
                return "add one more";

        }
    }
    const handleBack = () => {
        switch(activeStep) {
            case 0: close(); break;
            case 1: setActiveStep((prevStep) => prevStep - 1); break;
            case 2: setActiveStep((prevStep) => prevStep - 1); break;
            case 3: close(); break;
        }
    };
    const handleNext = () => {
        switch(activeStep) {
            case 0: setActiveStep((prevStep) => prevStep + 1); break;
            case 1: setActiveStep((prevStep) => prevStep + 1); break;
            case 2: toPostForm(); break;
            case 3: toCleanForm(); break;
        }
    }
    const disabledNext = () => {
        switch(activeStep) {
            case 0: return !(!isLoading && interlink.isChecked && !interlink.error && interlink.value);
            case 1: return !(!isLoading && locality.isChecked && !locality.error && locality.value);
            case 2: return !(!isLoading && interlink.isChecked && !interlink.error && interlink.value && locality.isChecked && !locality.error && locality.value);
            case 3: return false;
            default: return true;
        }
    }
    const disabledBack = () => {
        switch(activeStep) {
            case 2: return isLoading
            default: return false;
        }
    }
    const loadingNext = () =>{
        switch(activeStep) {
            case 2: return isLoading
            default: return false;
        }
    }

      ////////////////////////////////////////////
     ///кто прочитал тот лучший брат в мире :3///
    ////////////////////////////////////////////
    return (
        <Box
            sx={{
                p:2,
                height: `100%`
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Stepper activeStep={activeStep} alternativeLabel >
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box
                sx={{
                    py: 3,
                    px: 1,
                }}
                style={{
                    flex: 1,
                    overflowY: 'auto'
                }}
            >
                {formContent()}
            </Box>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 6, md: 8}} >
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleBack}
                        disabled={disabledBack()}
                    >
                        {backButtonContent()}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <LoadingButton
                        variant="contained"
                        fullWidth
                        onClick={handleNext}
                        disabled={disabledNext()}
                        loading={loadingNext()}
                    >
                        {nextButtonContent()}
                    </LoadingButton>
                </Grid>
            </Grid>
        </Box>
    );

}
export default AddGeoChatForm;