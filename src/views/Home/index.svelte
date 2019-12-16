<script>
  import { database } from '@config/firebase.js'
  let token = ''
  let nomineesJSON = ''

  let startCountButton = 0
  let freezeScoreboard = 0
  let currTab = 1

  $: message = ''
  $: JSONmessage = ''

  let startCountButtonConf = database.ref('app/start_count')
  startCountButtonConf.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      startCountButton = childData
    }) 
  })

  let freezeScoreboardnConf = database.ref('app/freeze_scoreboard')
  freezeScoreboardnConf.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      freezeScoreboard = childData
    }) 
  })

  function reset(){
    var ref = database.ref(`auth/admin`)
    ref.once('value')
    .then(function(snapshot) {
        let checkToken = token == snapshot.child('token').val()
        if(checkToken){
          database.ref('scoreboard').remove()
          message = 'Scoreboard has been reseted'
          token = ''
        }
        else{
          token = ''
          message = 'Whoops, wrong password'
        }
    });
  }

  function addNominee(image, name, position) {
    let uniqueID = Math.random().toString(36).substring(7)
    database.ref('nominees/' + uniqueID).set({
      count: 0,
      image,
      name,
      position,
      unique_id: uniqueID,
    }, function(error) {
      if (error)
        console.log(error)
      else
        JSONmessage = 'Nominees data has been renewed'
    })
  }
  
  function updateTitle(data) {
    database.ref('app/title').set({ value: data.title})
    database.ref('app/title_nominee').set({ value: data.title_nominee})
  }

  function handleNominees() {
    database.ref('nominees/').remove()
    let tempData = JSON.parse(nomineesJSON)
    updateTitle(tempData)
    tempData.nominees.forEach((value, index) => {
      addNominee(value.image, value.name, value.position)
    })
    nomineesJSON = ''
  }

  function handleStartCount() {
    database.ref('app/start_count').set({ value: startCountButton})
  }

  function handleTab(tab) {
    currTab = tab
  }
</script>
<style>
  .container{
    font-family: 'Roboto';
    display: flex;
    width: 100%;
    height: 100vh;
    color: white;
    flex-direction: column;
  }

  .flex{
    display: flex;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.2;
  }

  .custom-input{
    outline: none;
    border: 1px solid white;
    padding: 8px 10px;
    border-radius: 5px 0 0 5px;
  }

  .btn-reset{
    outline: none;
    background-color: #d35400;
    color: white;
    text-decoration: none;
    border: 1px solid #d35400;
    border-radius: 0 5px 5px 0;
    padding: 8px 10px;
  }

  .question-panel {
    width: calc(100% - 40px);
    padding: 0 20px;
  }

  textarea {
    width: calc(100% - 22px);
    max-width: calc(100% - 22px);
    min-width: calc(100% - 22px);
    min-height: 50vh;
    max-height: 80vh;
    outline: none;
    border: 1px solid white;
    padding: 8px 10px;
    border-radius: 5px;
    display: block;
  }

  .message{
    font-size: 12px;
  }

  .btn {
    color: white;
    background-color: #d35400;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 10px 15px;
    border-radius: 20px;
    margin: 10px 0;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    width: 100%;
  }

  .tab {
    display: flex;
    flex-direction: row;
    align-content: stretch;
    width: 100%;
  }

  .tab-item {
    width: 50%;
    text-align: center;
    padding: 20px 0;
    background-color: #e67e22;
    cursor: pointer;
  }

  .tab-item:hover, .tab-item.active {
    background-color: #ffa910;
    font-weight: bold;
  }

  .tab-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 59px);
    flex-direction: column;
  }

  .btn-start-count {
    border: 5px solid white;
    background-color: #d35400;
    height: 200px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 10px;
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .btn-start-count:active {
    transform: scale(0.8);
    box-shadow: 0 0 10px 20px #ffa910;
  }

  .btn-start-count .checkboxes {
    height: 0 !important;
    width: 0 !important;
    overflow: hidden;
    opacity: 0;
  }
</style>
<div class="container">
  <div class="tab">
    <div class="tab-item" class:active={currTab === 1} on:click={() => handleTab(1)}>Main Control</div>
    <div class="tab-item" class:active={currTab === 2} on:click={() => handleTab(2)}>Nominees</div>
  </div>
  {#if currTab === 1}
    <div class="tab-content">
      <label class="btn-start-count">
        <input class="checkboxes" type="checkbox" on:change={handleStartCount} bind:checked={startCountButton}>
        {startCountButton ? 'Started' : 'Start'}
      </label>
    </div>
  {:else if currTab === 2}
    <div class="tab-content">
      <h4>Input New Nominees</h4>
      <div class="question-panel">
        <textarea bind:value={nomineesJSON} placeholder="input raw json" cols="10"></textarea>
        <p class="message">{JSONmessage}</p>
        <button class="btn" class:disabled={nomineesJSON.length === 0} on:click={handleNominees}>Submit</button>
      </div>

      <h4>Reset Scoreboard</h4>
      <div class="flex">
        <input class="custom-input" bind:value={token} type="password" placeholder="TOKEN" />
        <button class="btn-reset" class:disabled={token.length === 0} on:click={reset}>RESET</button>
      </div>
      <p class="message">{message}</p>
    </div>
  {/if}
</div>