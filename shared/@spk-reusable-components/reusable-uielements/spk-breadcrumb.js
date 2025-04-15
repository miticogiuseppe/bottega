import React, { Fragment } from 'react'
import { Breadcrumb } from 'react-bootstrap'

const SpkBreadcrumb = ({ Customclass, as, Label, bsPrefix, children }) => {
  return (
    <Fragment>
      <Breadcrumb bsPrefix={bsPrefix} label={Label} as={as} className={Customclass}>
        {children}
      </Breadcrumb>
    </Fragment>
  )
}

export default SpkBreadcrumb