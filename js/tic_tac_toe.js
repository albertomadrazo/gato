board = (function($, window){
	var square_id = 1;
	var board_moves = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

	var player = 1;
	var symbols = ['o', 'x'];

	var line_position = '';

	function allEqual(arr){
		var first = arr[0];
		if(first === undefined || first === " "){
			return false;
		}
		for(var i = 1; i< arr.length; i++){
			if(arr[i] !== first){
				return false;
			}
		}
		return true;
	}

	function checkForWin(){

		var check = [
			checkVertical,
			checkHorizontal,
			checkDiagonalRight,
			checkDiagonalLeft
		]

		var squares_to_check = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [2, 4, 6]];

		if(checkVertical(squares_to_check[0])){
			return true;
		}
		if(checkHorizontal(squares_to_check[1])){
			return true;
		}
		if(checkDiagonalRight()){
			return true;
		}
		if(checkDiagonalLeft()){
			return true;
		}

		return false;

	}

	function checkVertical(arr){
		var temp_array = [];
		for(var i = 0; i < arr.length; i++){
			for(var j = arr[i]; j <= arr[i]+6; j += 3){
				temp_array.push(board_moves[j]);
			}
			
			if(allEqual(temp_array) === true){
				setLinePosition('vertical ' + (i + 1));
				return true;
			}
			temp_array = [];
		}
		return false;
	}

	function checkHorizontal(arr){
		var temp_array = [];
		for(var i = 0; i < arr.length; i++){
			for(var j = arr[i]; j <= arr[i]+2; j++){
				temp_array.push(board_moves[j]);
			}
			
			if(allEqual(temp_array)){
				setLinePosition('horizontal ' + (i + 1));
				return true;
			}
			temp_array = [];
		}

		return false;
	}

	function checkDiagonalRight(){
		var temp_array = [board_moves[0], board_moves[4], board_moves[8]];
		if(allEqual(temp_array)){
			setLinePosition('diagonal 1');
			return true;
		}

		return false;
	}

	function checkDiagonalLeft(){
		var temp_array = [board_moves[2], board_moves[4], board_moves[6]];
		if(allEqual(temp_array)){
			setLinePosition('diagonal 2');
			return true;
		}

		return false;
	}

	function getContainer(){
			
		var container = '';

		for(var i = 0; i < 9; i++){
			container += '<div class="square cont-square" id="' + (i+1) + '">'+ board_moves[i] +'</div>';
		}

		return container;
	}	

	function styleGrid(){
		var style_vertical = [1,2,0,4,5,0,7,8 ];
		var selector = '';

		for(var i = 0; i < 9; i++){
			selector = 'div#'+(i+1);
			if(i < 6){
				$(selector).css('border-bottom', '2px solid black');
			}

			if(style_vertical[i]){
				$(selector).css('border-right', '2px solid black');
			}
		}
	}

	function checkForTie(){
		var tie = true;

		for(var i = 0; i < board_moves.length; i++){
			if(board_moves[i] === " " || board_moves[i] === undefined){
				tie = false;
			}
		}
		return tie;
	}

	var getPlayer = function(){
		return player;
	}

	var setPlayer = function(num){
		player = num;
	}

	var getLinePosition = function(){
		return line_position;
	}

	var setLinePosition = function(pos){
		line_position = pos
	}

	return{
		board_moves: board_moves,
		getContainer: getContainer,
		styleGrid: styleGrid,
		getPlayer: getPlayer,
		setPlayer: setPlayer,
		symbols: symbols,
		checkForWin: checkForWin,
		checkForTie: checkForTie,
		getLinePosition: getLinePosition
	};

})(jQuery, window);

$(document).ready(function(){

	var player = 1;
	var score1 = 0;
	var score2 = 0;
	var clickable_board = true;

	$('div#container').html(board.getContainer());
	board.styleGrid();	

	$('.cont-square').on('click', function(){
		// If there is a winner or a tie, the board cannot be clicked for 2 seconds.
		if(!clickable_board) return;

		if(board.board_moves[parseInt($(this).attr('id'))-1] === " "){
			board.board_moves[parseInt($(this).attr('id'))-1] = board.symbols[board.getPlayer()-1];
			$(this).html(board.symbols[board.getPlayer()-1]);

			if(board.getPlayer() === 1){
				board.setPlayer(2);
			}
			else if(board.getPlayer() === 2){
				board.setPlayer(1);
			}
		}
		var got_winner = board.checkForWin();
		if(got_winner){
			(board.getPlayer() === 1) ? score1 += 1 : score2 += 1;
			$('#player-score-1').html(score1);
			$('#player-score-2').html(score2);
			drawWinningLine(board.getLinePosition());
			nuevoJuego(1500);
			return;
		}

		var tie = board.checkForTie();

		if(tie){
			console.log(board.getPlayer());
			var tie_CSS = {
					'-webkit-transform': 'none',
					'-moz-transform': 'none',
					'-o-transform': 'none',
					'transform': 'none',
					top: '65px',
					left: '36%',
					visibility: 'visible',
					width: '250px', 
					height: '250px'
			};
			$('.linea').css(tie_CSS);
			nuevoJuego(1000);
		}


	});	

	function nuevoJuego(timeout_seconds){
		try{
			var time_left = parseInt(timeout_seconds.data.time_left);
		}
		catch(e){
			time_left = 2000;
		}

		clickable_board = false;
		setTimeout(function(){
			$('.linea').css({visibility: 'hidden'});
			for(var i = 0; i < board.board_moves.length; i++){
				board.board_moves[i] = " ";
			}	

			$('.square').each(function(){
				$(this).html(" ");
			});	

			board.getContainer();
			clickable_board = true;

			board.setPlayer(1);

		}, time_left);
	}

	function drawWinningLine(position){
		var line_CSS = {};
		var line_direction_CSS = {};
		var broken_position = position.split(" ");

		if(broken_position[0] === 'vertical'){
			if(broken_position[1] === '1'){
				line_direction_CSS = {
					right: '60%', 
				};
			}	
			else if(broken_position[1] === '2'){
				line_direction_CSS = {
					right: '49%', 
				};
			}
			else if(broken_position[1] === '3'){
				line_direction_CSS = {
					right: '38%', 
				};
			}
			line_CSS = {
				'-webkit-transform': 'none',
				'-moz-transform': 'none',
				'-o-transform': 'none',
				'transform': 'none',
				top: '49px',
				visibility: 'visible',
				width: '20px', 
				height: '285px',
			};
			line_CSS = $.extend(line_CSS, line_direction_CSS);
		}
		else if(broken_position[0] === 'horizontal'){
			if(broken_position[1] === '1'){
				line_direction_CSS = {
					top: '82px', 
				};
			}	
			else if(broken_position[1] === '2'){
				line_direction_CSS = {
					top: '181px', 
				};
			}
			else if(broken_position[1] === '3'){
				line_direction_CSS = {
					top: '280px', 
				};
			}
			line_CSS = {
				'-webkit-transform': 'none',
				'-moz-transform': 'none',
				'-o-transform': 'none',
				'transform': 'none',
				left: '34%',
				top: '70px',
				visibility: 'visible',
				width: '285px', 
				height: '20px',
			};
			line_CSS = $.extend(line_CSS, line_direction_CSS);
		}
		else if(broken_position[0] === 'diagonal'){
			if(broken_position[1] === '1'){
				line_direction_CSS = {
					right: '60%',
					'-webkit-transform': 'rotate(-45deg)',
					'-moz-transform': 'rotate(-45deg)',
					'-o-transform': 'rotate(-45deg)',
					'transform': 'rotate(-45deg)'
				};
			}	
			else if(broken_position[1] === '2'){
				line_direction_CSS = {
					right: '38%',
					'-webkit-transform': 'rotate(45deg)',
					'-moz-transform': 'rotate(45deg)',
					'-o-transform': 'rotate(45deg)',
					'transform': 'rotate(45deg)'
				};
			}
			line_CSS = {
				visibility: 'visible',
				top: '40px', 
				left: '48%', 
				width: '20px', 
				height: '300px'
			};
			line_CSS = $.extend(line_CSS, line_direction_CSS);
		}

		$('.linea').css(line_CSS);
	}

	$('.new-game').click({time_left: 0}, nuevoJuego);

});