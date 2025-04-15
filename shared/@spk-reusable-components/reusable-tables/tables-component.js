
import React, { Fragment } from 'react';
import { Table } from 'react-bootstrap';

const SpkTablescomponent = ({ children, tableClass, headerClass, header, footerClass, footchildren, headerContent, tBodyClass, checked, showCheckbox = false, Customcheckclass, onChange }) => {
    return (
        <Fragment>
            <Table className={tableClass}>
                {headerContent}
                <thead className={headerClass}>
                    <tr>
                        {showCheckbox && (
                            <th className={Customcheckclass}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkboxNoLabel02"
                                    defaultValue=""
                                    checked={checked}
                                    aria-label="..."
                                    onChange={onChange}
                                />
                            </th>
                        )}
                        {header && header.map((headerItem, index) => (
                            <th key={index} className={headerItem.headerClassname}>
                                {headerItem.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={tBodyClass}>
                    {children}
                </tbody>
                <tfoot className={footerClass}>
                    {footchildren}
                </tfoot>
            </Table>
        </Fragment>
    );
}

export default SpkTablescomponent;
