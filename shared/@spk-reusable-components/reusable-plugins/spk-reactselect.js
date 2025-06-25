import Select, { Props as SelectProps } from 'react-select';

const SpkSelect = ({ option, menuplacement, id, autofocus, noOptionsmessage, classNameprefix, defaultvalue, mainClass, onfunchange, disabled, name, getValue, clearable, multi, searchable, placeholder, ...rest }) => {

    return (
        <>
            <Select name={name} options={option} className={mainClass} id={id} onChange={onfunchange} isDisabled={disabled} isMulti={multi}
                menuPlacement={menuplacement} classNamePrefix={classNameprefix} defaultValue={defaultvalue} value={getValue} isClearable={clearable} isSearchable={searchable} placeholder={placeholder}
                autoFocus={autofocus} noOptionsMessage={noOptionsmessage} {...rest}
            />
        </>
    )
}
export default SpkSelect;