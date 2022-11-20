const socket = io()

// socket.on('message',(msg)=>{
//     console.log(msg)
// })

const $form = document.querySelector('form')
const $sendMessageButton = document.querySelector('#submit')
const $input = document.querySelector('#message')

const messageTemplate = document.querySelector('#message-template').innerHTML
const $messages = document.querySelector('#messages')

const locationTemplate = document.querySelector('#location-template').innerHTML

const $sendLocation = document.querySelector('#send-location')

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const $sidebarElement = document.querySelector('#sidebar')

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})


socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(Math.round(containerHeight - newMessageHeight - 1) <= Math.round(scrollOffset)){
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message',(msg)=>{

    const html = Mustache.render(messageTemplate,{msg:msg.msg,
        createdAt:moment(msg.createdAt).format('h:mm a'),
        username:msg.username
    })
    
    $messages.insertAdjacentHTML('beforeend',html)
    
    console.log(msg)
})

socket.on('locationmessage',(url)=>{

    console.log(url)

    const locationElement = Mustache.render(locationTemplate,{url:url.url,
        createdAt:moment(url.createdAt).format('h:mm a'),
        username:url.username
    })
    $messages.insertAdjacentHTML('beforeend',locationElement)
})

socket.on('userlist',({users,room})=>{
    
    const html = Mustache.render(sidebarTemplate,{users,room})
    $sidebarElement.innerHTML = html

})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    $sendMessageButton.setAttribute('disabled','disabled')
    const input = $input.value
    socket.emit('sendMessage',input,(msg)=>{
        $sendMessageButton.removeAttribute('disabled')
        $input.value = ''
        $input.focus()
        console.log(msg)
    })

})

$sendLocation.addEventListener('click',()=>{
    
    if(!navigator.geolocation)
        return alert('geolocation is not supported')
    
    $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('location',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(msg)=>{
            $sendLocation.removeAttribute('disabled')
            console.log(msg)
        })
    })
})



// socket.on('countUpdated',(count)=>{
//     console.log('count has been updated ',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
    
//     socket.emit('increment')

// })
