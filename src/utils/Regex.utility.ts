const LabelFormate = (label: string) => {
    const formatedLabel = label
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^\w/, c => c.toUpperCase());
    return formatedLabel
}

const RegexUtility = {
    LabelFormate
}

export default RegexUtility