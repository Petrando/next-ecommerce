export const errorHandler = (err) => {
    if(err.hasOwnProperty('code')){
        let propError = ''
        for(let prop in err.keyPattern){
            propError = prop
        }

        return `${propError} sudah terdaftar`
    }
    else if(err.message){
        return err.message.substring(err.message.indexOf('User validation failed: '))
    }
}