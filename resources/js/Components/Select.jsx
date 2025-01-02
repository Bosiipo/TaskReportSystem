export default function Select({
    id,
    name,
    value,
    onChange,
    options,
    className,
}) {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-select ${className}`}
        >
            <option value="">Select an option</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
}
