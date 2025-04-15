import React, { Fragment } from 'react'
import { Badge } from 'react-bootstrap'

const SpkBadge = ({ children, Customclass, variant, Pill, Text, bsPrefix, Id, as, Onclickfun }) => {
  return (
    <Fragment>
      <Badge bg={variant} className={`badge ${Customclass}`} pill={Pill} text={Text} as={as} bsPrefix={bsPrefix} id={Id} onClick={Onclickfun}>
        {children}
      </Badge>
    </Fragment>
  )
}

export default SpkBadge