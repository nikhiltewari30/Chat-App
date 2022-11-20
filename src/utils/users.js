const users = []

const addUsers = ({id,username,room})=>{
    
    username = username.trim().toLowerCase()

    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error:'username and room are required'
        }
    }

    const userFound = users.find((user)=>{
        if(user.username == username && user.room == room)
            return user
    })

    if(userFound){
        return {
            error:'username already exist'
        }
    }
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{

    const index = users.findIndex(user => user.id == id)
    
    if(index !== -1)
        return users.splice(index,1)[0]
}



const getUser = (id)=>{
    return users.find(user => user.id === id)
}

const getUsersInRoom = (roomname) => {
    return users.filter(user => user.room === roomname)
}

module.exports = {
    addUsers,getUser,getUsersInRoom,removeUser
}







