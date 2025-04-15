import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const SpkTooltips = ({ title, id, children, placement, tooltipClass, trigger }) => {
    return (
        <OverlayTrigger placement={placement} delay={{ show: 250, hide: 400 }} overlay={<Tooltip id={id} className={tooltipClass}>{title}</Tooltip>}>
            {children}
        </OverlayTrigger>
    );
}

export default SpkTooltips;
