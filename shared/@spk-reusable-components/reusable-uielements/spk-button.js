import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap'

const SpkButton = ({ Buttonvariant, Style, Buttontype, Customclass, children, bsPrefix, Role, as, Size, Active, Expand, Navigate, Disabled, Id, onClickfunc, onChangefunc, Buttontoggle, Buttonlabel, Buttondismiss, Buttoncontrols, Value, Tabindex, Buttontarget, ...props }) => {
  return (
    <Fragment>
      <Button type={Buttontype} id={Id} style={Style} bsPrefix={bsPrefix} as={as} variant={Buttonvariant} role={Role} href={Navigate} size={Size} active={Active} disabled={Disabled} data-bs-toggle={Buttontoggle} aria-expanded={Expand} data-bs-target={Buttontarget}
        tabIndex={Tabindex} onClick={onClickfunc} value={Value} className={`btn-wave ${Customclass}`} onChange={onChangefunc} data-bs-dismiss={Buttondismiss} aria-label={Buttonlabel} aria-controls={Buttoncontrols} {...props}>
        {children}
      </Button>
    </Fragment>
  )
}

export default SpkButton