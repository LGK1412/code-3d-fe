export default function CheckboxGroup({ label, options, selected, exclude = [], onChange }) {
    const toggle = (value) => {
        const updated = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
        onChange(updated);
    };

    return (
        <div className="mb-4">
            <h2 className="font-semibold text-gray-700 mb-1">{label}</h2>
            <div className="flex gap-4 flex-wrap">
                {options.map((opt) => {
                    const disabled = exclude.includes(opt);
                    return (
                        <label key={opt} className="flex items-center gap-1 text-sm">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt)}
                                disabled={disabled}
                                onChange={() => toggle(opt)}
                            />
                            <span className={disabled ? 'text-gray-400 line-through' : ''}>{opt}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

