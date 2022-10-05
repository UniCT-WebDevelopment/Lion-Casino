const ball = $(".ball");
const wheel = $(".wheel")
const wrap = $(".wrap");
const throwBall = $(".throw");
const title = $(".title");
const headOne = $(".h1");
const headTwo = $(".h2");
const start = $(".start");
let $input = $('.name');
let $value = $input.val();
var puntate=[];



const degrees = {
  7: 720,
  28: 729,
  12: 738,
  35: 748,
  3: 758,
  26: 768,
  0: 777,
  32: 787,
  15: 797,
  19: 807,
  4: 817,
  21: 826,
  2: 836,
  25: 846,
  17: 856,
  34: 865,
  6: 875,
  27: 885,
  13: 895,
  36: 905,
  11: 914,
  30: 924,
  8: 934,
  23: 944,
  10: 954,
  5: 964,
  24: 974,
  16: 983,
  33: 993,
  1: 1003,
  20: 1012,
  14: 1022,
  31: 1032,
  9: 1042,
  22: 1051,
  18: 1061,
  29: 1070,
}

class Selection {
  constructor(val) {
    this.val = val;
    this.$input = $('.name');
    this.$value = "";
    this.grabInput = this.grabInput.bind(this);
    this.tableClick = this.tableClick.bind(this);
  }

  
  table() {
    // let that = this
    $(".flex-item").unbind('click')
    
    $(".flex-item").on("click", this.tableClick)
  }

  tableClick(event) {
  
      this.val = event.currentTarget.id
      if(puntate.indexOf(this.val)==-1){
        puntate.push(this.val);
        
      }else{
        puntate.splice(puntate.indexOf(this.val),1);
      }
      console.log("ciao")
      $(".h1").css("display", "inline");
      
      headOne.html(`${this.$value} selected <span id='selected'>${puntate}</span>`);
      headTwo.css("display", "none");
      throwBall.css("display", "inline");
      throwBall.on();
  }

 
  ballThrow() {
    throwBall.click(function() {
      console.log("Ball Thrown")
      $(".flex-item").off();
      throwBall.off();
        let winningNumber = Math.floor(Math.random() * 38)
        let rotation = degrees[winningNumber];
      
      ball.css("animation", "ballDrop 2s forwards ease-in-out");
      wrap.animate({ $blah: rotation}, {
        step: function(now, fx) {
        $(this).css('transform', `rotate(${now}deg)`);
        }, duration: 5000,
        complete: function() {
         
            console.log(puntate.indexOf[winningNumber]);
         if(puntate.indexOf[winningNumber]) {
            $(".outcome").css("display", "inline");
            $(".outcome").html("You Win!")
            $(".restart").css("display", "inline");
          } else {
            $(".outcome").css("display", "inline");
            $(".outcome").html("You Lose!")
            $(".restart").css("display", "inline");
          }
        }
      });
      game.restartGame()
    });
  }

  startGame() {
    start.click(function() {
      $(".p2").css("display", "none");
      $(".submit").css("display", "none");
      $(".directions").css("display", "none");
      $(".name").css("display", "none");
      $(".wheel").css("display", "inline");
      $(".table").css("display", "inline");
      $(".h2").css("display", "inline");
      game.table()
    });
  }


  restartGame() {
    $(".restart").click(function() {
      $(document).ready(function(){
        $(".restart").click(function(){
            location.reload(true);
        });
      });
    });
    //   game.startGame()
    //   $(".h2").css("display", "inline");
    //   $(".h1").css("display", "none");
    //   ball.css("animation", "ballReset");
    //   $(".outcome").css("display", "none");
    //   $(".restart").css("display", "none");
    //   throwBall.css("display", "none");
    //   game.table()

    //   // game.ballThrow()
    //   throwBall.click(function() {
    //     console.log("Ball Thrown")
    //     $(".flex-item").off();
    //     throwBall.off();
    //       let winningNumber = Math.floor(Math.random() * 38)
    //       let rotation = degrees[winningNumber];
    //     ball.css("animation", "ballDrop 2s forwards ease-in-out");
    //     wrap.animate({ $blah2: rotation}, {
    //       step: function(now, fx) {
    //       $(this).css('transform', `rotate(${now}deg)`);
    //       }, duration: 5000,
    //       complete: function() {
    //         wrap.css("animation", "stop");
    //         if(winningNumber === parseInt($("#selected")[0].innerText)) {
    //          $(".outcome").css("display", "inline");
    //          $(".outcome").html("You Win!")
    //          $(".restart").css("display", "inline");
    //         } else {
    //          $(".outcome").css("display", "inline");
    //          $(".outcome").html("You Lose!")
    //          $(".restart").css("display", "inline");
    //         }
    //       }
    //     });
    //   });
    // });
  }

  
  inputForm() {
    const $button = $('button').click(this.grabInput)
    game.startGame()
  }

  grabInput() {
    this.$input = $('.name')
    this.$value = this.$input.val()
    this.table()
  }
}

const game = new Selection()
game.inputForm()
game.ballThrow()

