import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const SpkProgress = ({variant, now = 0, mainClass, role, animated = false, striped = false, label}) => {
    return (
        <ProgressBar variant={variant} now={now} className={mainClass} role={role} animated={animated} striped={striped} label={label} />
    );
}

export default SpkProgress;