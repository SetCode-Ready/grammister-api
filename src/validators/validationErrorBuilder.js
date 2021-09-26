const validationErrorBuilder = (errors) => {
    const errorMessages = errors.error?.details 
        ? errors.error?.details.map(detail => {
                return {
                    type: detail.context?.key,
                    message: detail.message
                }
            })
        : [];

    return (errorMessages.length > 0)
        ? { errors: errorMessages, valid: false }
        : { errors: errorMessages, valid: true }
}

module.exports = { validationErrorBuilder };