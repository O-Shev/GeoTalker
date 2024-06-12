import {ListItemText} from "@mui/material";
import React from "react";

const LocalityItemContent = ({l}) => {
    const addresses = l.displayName.split(',');
    const firstElement = addresses[0];
    const secondElement = addresses.slice(1).reverse().join(", ");

    return (
        <ListItemText
            sx={{width: 200}}
            primary={firstElement}
            secondary={secondElement}
            primaryTypographyProps={{
                noWrap: true,
            }}
            secondaryTypographyProps={{
                noWrap: true,
            }}
        />
    )
}

export default LocalityItemContent;