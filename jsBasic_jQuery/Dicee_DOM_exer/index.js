// this file links to js_exer_basic/Dicee_DOM_exer/dicee.html

function random_dice(dice_img1, dice_img2, result_title) {
  let randomNumber1 = Math.floor(Math.random() * 6) + 1;
  let randomNumber2 = Math.floor(Math.random() * 6) + 1;
  let new_src1 = "images/dice" + randomNumber1 + ".png";
  let new_src2 = "images/dice" + randomNumber2 + ".png";
  dice_img1.src = new_src1;
  dice_img2.src = new_src2;
  if (randomNumber1 > randomNumber2) {
    result_title.textContent = "🚩Player 1 wins!";
  } else if (randomNumber1 < randomNumber2) {
    result_title.textContent = "Player 2 wins!🚩";
  } else {
    result_title.textContent = "Draw!";
  }
}

function back_default(dice_img1, dice_img2, result_title) {
  dice_img1.src = "images/dice6.png";
  dice_img2.src = "images/dice6.png";
  result_title.textContent = "Refresh Me";
  // if 'var' was used instead of 'let', use 'var' again to reinitiate the elements that have been rendered to browser
}

function dice_main() {
  let dice_img1 = document.getElementById("dice-img1");
  let dice_img2 = document.getElementById("dice-img2");
  let result_title = document.querySelector("#dice-click");
  random_dice(dice_img1, dice_img2, result_title);
  // set back to default after 5 seconds
  setTimeout(back_default, 5000, dice_img1, dice_img2, result_title);
}
