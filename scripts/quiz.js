var player = {
  score: 0,
  questions: 0,
}

var receive_answers = true;

function set_statement(text) {
  let statement_element = document.querySelector(".statement p");
  statement_element.innerHTML = text;
}

function get_options() {
  return document.querySelectorAll(".options ul li");
}

function set_option(index, text) {
  let options_elements = get_options();
  options_elements[index].innerHTML = text;
}

function set_score(new_score) {
  let score_elements = document.querySelectorAll(".score p");
  score_elements[0].innerHTML = languagePack[0] + ": " + new_score + "/" + questions.length;
}

function set_question(question) {
  let score_elements = document.querySelectorAll(".score p");
  score_elements[1].innerHTML = languagePack[1] + ": " + question + "/" + questions.length;
}

function set_record(record) {
  let score_elements = document.querySelectorAll(".score p");
  score_elements[2].innerHTML = languagePack[2] + ": " + record + "/" + questions.length;
  localStorage.setItem("quiz_record", record);
}

function update_record() {
  set_record(get_record());
}

function get_record() {
  return Number(localStorage.getItem("quiz_record"));
}

function end_quiz() {
  alert(`${languagePack[3]}: ${player.score}\n${languagePack[2]}: ${get_record()}`);
  if(player.score > get_record()) set_record(player.score);
  start();
}

function change_question(question_index) {

  let question = questions[question_index];

  if(!question) return end_quiz();
  if(question.options.length != 4) return console.log("Invalid question");

  set_statement(question.statement);
  
  for(let i = 0; i < question.options.length; i++) {
    set_option(i, question.options[i]);
  }

  set_question(player.questions+1);

}

function get_current_question() {
  return questions[player.questions];
}

function set_option_color(index, color) {
  let options = get_options();

  if(color == "default") {
    options[index].classList.remove("correct");
    options[index].classList.remove("wrong");
    return;
  }

  options[index].classList.add(color);
}

function set_correct_option_green() {
  let question = get_current_question();
  set_option_color(question.correct, "correct");
}

function set_wrong_option_red(index) {
  set_option_color(index, "wrong");
}

function get_correct_option() {
  return get_current_question().correct;
}

function clear_options_colors() {
  for(let i = 0; i < get_options().length; i++) {
    set_option_color(i, "default");
  }
}

function option_selected(index) {

  if(!receive_answers) return;
  
  set_correct_option_green();

  let correct_option = get_correct_option();

  if(correct_option != index) set_wrong_option_red(index);
  else player.score++;

  receive_answers = false;

  setTimeout(() => {
    player.questions++;
    clear_options_colors();
    set_score(player.score);
    change_question(player.questions);
    receive_answers = true;
  }, 1000);
}

function listen_options() {
  let options_elements = get_options();
  for(let i = 0; i < options_elements.length; i++) {
    options_elements[i].addEventListener("click", () => { option_selected(i); })
  }
}

function start() {
  player = {score: 0, questions: 0};
  set_score(player.score);
  update_record();
  change_question(0);
  listen_options();
}

start();