const set = (msg,username)=>{
    return {
        username,
        msg,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessage = (url,username)=>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    set,generateLocationMessage
}
