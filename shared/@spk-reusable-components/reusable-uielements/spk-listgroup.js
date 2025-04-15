import React, { Fragment } from 'react'
import { ListGroup } from 'react-bootstrap'

const SpkListgroup = ({ CustomClass, children, Numbered, Horizontal, as, Variant, bsPrefix, Id, }) => {
  return (
    <Fragment>
      <ListGroup variant={Variant} horizontal={Horizontal} numbered={Numbered} bsPrefix={bsPrefix} as={as} className={CustomClass} id={Id}>
        {children}
      </ListGroup>
    </Fragment>
  )
}

export default SpkListgroup