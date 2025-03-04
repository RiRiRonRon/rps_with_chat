console.log('hi');

let player1Score=0;
let player2Score=0;


const socket=io();
let roomUniqueId=null;
let player1=false;
function createGame(){
    socket.emit("createGame");
    player1=true;

}

function joinGame(){
    roomUniqueId=document.getElementById("roomUniqueId").value;
    socket.emit("joinGame",{roomUniqueId:roomUniqueId});
    socket.emit("joinChat",{roomUniqueId:roomUniqueId},message=>{
        displayMessage(message,true);
    });

}

socket.on("newGame",(data)=>{
    roomUniqueId=data.roomUniqueId;
    console.log(roomUniqueId);
    document.getElementById('initial').style.display="none"
    document.getElementById('gamePlay').style.display="block"
    //document.getElementById("chat").style.display="block"
    document.getElementById("hawScore").style.display="none"
    document.getElementById('waitingArea').innerHTML=`Stanna sa7bek. haw codek <span>${roomUniqueId}</span> partajiw wiou`;
    let copyButton=document.createElement('button');
    copyButton.innerText="Copy Nayyek";
    copyButton.style.display="block";
    copyButton.addEventListener('click', ()=>{
        navigator.clipboard.writeText(roomUniqueId).then(
            function(){
                console.log("code COpy good");
            }, function(err){
                console.error("COpy bad", err);
            }

        )
    })
    document.getElementById("waitingArea").appendChild(copyButton);


    

    

})

socket.on("playersConnected",()=>{
    document.getElementById("waitingArea").style.display='none';
    document.getElementById("gameArea").style.display="block";
    document.getElementById("gamePlay").style.display="block";
    document.getElementById("initial").style.display="none";
    document.getElementById("hawScore").style.display="flex";
    



})

function sendChoice(rpschoice){
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent,{rpschoice:rpschoice, roomUniqueId:roomUniqueId});
    let playerChoiceButton=document.createElement("button");
    playerChoiceButton.style.display="block";
    playerChoiceButton.innerText=rpschoice;
    playerChoiceButton.id = rpschoice + "-btn";
    playerChoiceButton.classList.add('btn');
    document.getElementById("btn-container").innerHTML="";
    document.getElementById("btn-container").appendChild(playerChoiceButton);

    


}

socket.on("p1Choice",(data)=>{
    if (!player1){
        createChoiceButton(data);

    }

})
socket.on("p2Choice",(data)=>{
    if (player1){
        createChoiceButton(data);

    }
    
})

function  createChoiceButton(data){
    document.getElementById("eywelle").innerHTML="cbon player2 i5tar 5if ja3bek";
    let player2Button=document.createElement('button');
    player2Button.id=""
    player2Button.innerText=data.rpschoice;
    player2Button.classList.add('btn');
    player2Button.classList.add("hidden");
    player2Button.classList.add("player2Btn");
    player2Button.id = data.rpschoice + "-btn";
    document.getElementById("player2Choice").appendChild(player2Button);

    
}   


socket.on("result",(data)=>{
    let winnerText = '';
    if(data.winner != 'd') {
        if(data.winner == 'p1' && player1) {
            winnerText = 'You win';
            player1Score++;            
        } else if(data.winner == 'p1') {
            winnerText = 'You lose';
            player2Score++;
        } else if(data.winner == 'p2' && !player1) {
            winnerText = 'You win';
            player1Score++;
        } else if(data.winner == 'p2') {
            winnerText = 'You lose';
            player2Score++;
        }
    } else {
        winnerText = `It's a draw`;
    }
    document.getElementById('eywelle').style.display = 'none';
    
    let opponentButton = document.querySelector(".player2Btn"); 
    
    opponentButton.classList.remove("hidden");
        

    document.getElementById('winnerArea').innerHTML = winnerText;
    document.getElementById('winnerArea').style.display = 'block';
    document.getElementById('p1Score').innerText = player1Score;
    document.getElementById('p2Score').innerText = player2Score;
    let replayButton = document.querySelector(".replay"); 
    
    replayButton.classList.remove("hidden");
        
});


function replay(){
    const btnContainer = document.getElementById('btn-container');
    const buttonsHTML = `
        <button onclick="sendChoice('Hajra')" id="Hajra-btn" class="btn"> 7ajra</button>
        <button onclick="sendChoice('War9a')" id="War9a-btn" class="btn"> War9a</button>
        <button onclick="sendChoice('M9as')" id="M9as-btn" class="btn"> M9as</button>
    `;
    btnContainer.innerHTML = buttonsHTML;

    let replayButton = document.querySelector(".replay"); 
    replayButton.classList.add("hidden");
    
    document.getElementById('winnerArea').style.display = 'none';
    document.getElementById('eywelle').style.display = 'block ';
    document.getElementById('eywelle').innerText = 'Player 2, 3osso rzin stanneh';

    let opponentButton = document.querySelector(".player2Btn"); 
    
    opponentButton.classList.add("hidden");
    if (opponentButton) {
        opponentButton.remove(); 
    }

    

}


const chatToggle = document.getElementById("chat-toggle");
const chatModal = document.getElementById("chat-modal");
const messageInput=document.getElementById("message-input");


chatToggle.addEventListener("click", () => {
    chatModal.style.display = (chatModal.style.display === "flex") ? "none" : "flex";
});

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    message=messageInput.value;
    if (message==="") return;
    displayMessage(message,true);
    socket.emit('send-message',message,roomUniqueId);
    messageInput.value="";
    
})


socket.on("joinChat", (data) => {
    displayMessage(`You joined room ${roomUniqueId}`,true);
    
    
});
socket.on("receive-message", message => {
    displayMessage(message, false); 
});
    

function displayMessage(message,isSent){
    const div=document.createElement("div");
    div.textContent=message;
    if (isSent) {
        div.classList.add("sent");
    } else {
        div.classList.add("received");
    }
    document.getElementById('message-container').append(div);



}