<script>
  import { database } from '@config/firebase.js'
  let token = ''
  let questionJSON = ''
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

  
  function addQuestion(answer_1, answer_2, answer_3, answer_4, correct_answer, question) {
    let uniqueID = Math.random().toString(36).substring(7)
    database.ref('question/' + uniqueID).set({
      answer_1: answer_1,
      answer_2: answer_2,
      answer_3: answer_3,
      answer_4: answer_4,
      correct_answer: parseInt(correct_answer, 10),
      question: question,
      unique_id: uniqueID,
    }, function(error) {
      if (error)
        console.log(error)
      else {
        JSONmessage = 'Question data has been renewed'
        console.log('question data has been saved')
      }
    })
  }
  
  function handleQuestion () {
    database.ref('question/').remove()
    database.ref('scoreboard/').remove()
    let tempData = JSON.parse(questionJSON)
    tempData.question.forEach(function(value, index) {
      addQuestion(value.answer_1, value.answer_2, value.answer_3, value.answer_4, value.correct_answer, value.question)
    })
    questionJSON = ''
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
    opacity: 0.6;
  }

  .custom-input{
    outline: none;
    border: 1px solid white;
    padding: 8px 10px;
    border-radius: 5px 0 0 5px;
  }

  .btn-reset{
    outline: none;
    background: #107eeb;
    color: white;
    text-decoration: none;
    border: 1px solid #107eeb;
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
    border: none;
    outline: none;
    font-size: 16px;
    padding: 10px 15px;
    border-radius: 20px;
    margin: 10px 0;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
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
    border: 5px solid #d35400;
    background-color: #d35400;
    height: 200px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 10px;
    text-align: center;
    font-size: 40px;
  }

  .btn-start-count:active {
    transform: scale(0.8)
  }

  .btn-start-count .checkboxes {
    height: 0;
    width: 0;
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
        <textarea bind:value={questionJSON} placeholder="input raw json" cols="10"></textarea>
        <p class="message">{JSONmessage}</p>
        <button class="btn btn-question" class:disabled={questionJSON.length === 0} on:click={handleQuestion}>Add Question</button>
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