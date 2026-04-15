export function validateBody(requiredFields = []){
    return(req, res, next) =>{
        const missing = requiredFields.filter(
            (f) => req.body?.[f] === undefined || req.body?.[f] === ""
        );
        if(missing.length){
            return res.status(400).json({
                // error:`Misisng required fields: ${missing.join(", ")}`
                error:`Missing required fields: ${missing.join(",")}`
            })
        }
        next();
    };
}