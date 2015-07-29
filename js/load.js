var loading_status = -1;
var loading_elements = 5 + 52;

function load_media(element)
{
	loading_status++;
	if (element == undefined)
	{
		element = 0;
		is_loading = true;
		is_menu = false;
		start_loop();
		
		cards_image = [];
		background_image = new Image();
		background_image.src = "js/images/game_background.png";
		background_image.addEventListener('load', function() { load_media(element + 1) },false);
	}
	else if (element == 1)
	{
		card_image = new Image();
		card_image.src = "js/images/cards.png";
		card_image.addEventListener('load', function() { load_media(element + 1) },false);
	}
	else if (element == 2)
	{
		player_image = new Image();
		player_image.src = "js/images/player.png";
		player_image.addEventListener('load', function() { load_media(element + 1) },false);
	}
	else if (element == 3)
	{
		table_image = new Image();
		table_image.src = "js/images/table.png";
		table_image.addEventListener('load', function() { load_media(element + 1) },false);
	}
	else if (element == 4)
	{
		skip_image = new Image();
		skip_image.src = "js/images/skip.png";
		skip_image.addEventListener('load', function() { load_media(element + 1) },false);
	}
	else if (element == 5)
	{
		arrow_image = new Image();
		arrow_image.src = "js/images/arrow_down.png";
		arrow_image.addEventListener('load', function() { load_media(element + 1) },false);
	}
	else if (element >= 6 && element <= loading_elements + 1)
	{
		var i = element - 6;
		
		if (element <= loading_elements)
		{
			cards_image[i] = new Image();
			cards_image[i].src = "js/images/cards/" + i + ".png";
			cards_image[i].addEventListener('load', function() { load_media(element + 1) },false);
				
			document.getElementById("option_cards").innerHTML += "<span class='option_card_container' style='background:url(js/images/cards/" + i + ".png); background-size: 100% 100%;' id='card_" + i + "'><span class='num'>1x</span><span class='option_cards_add' onclick='add_card_to_deck(this)'>+</span><span class='option_cards_remove' onclick='remove_card_from_deck(this)'>-</span></span>";
		}
		if (i > 0)
		{
			loading_cards[i-1] = new Card(i-1, -original_width, -original_height / 2, true, 0);
			loading_cards[i-1].is_moving = true;
			loading_cards[i-1].moving_type = true;
			loading_cards[i-1].newDrawX = 0 - loading_cards[i-1].width;
			loading_cards[i-1].newDrawY = original_height / 2 - loading_cards[i-1].height;
			loading_cards[i-1].newRotate = Math.round(Math.random()*20);
			loading_cards[i-1].rotate = 0;
			
			if (element > loading_elements)
				loading_cards[i-1].moving_action = "stop_load";
		}
	}
	else if (element == "start")
	{
		is_loading = false;
		update_card_deck("default");
		new_game(0);
		is_menu = true;
	}
}

var loading_cards = [];

function loading_screen()
{
	if (loading_status >= 1)
		main_ctx.drawImage(background_image, 0, 0, game_width, game_height);
	else
	{
		main_ctx.fillStyle = "#0f1e1e";
		main_ctx.fillRect(0,0,game_width, game_height);
	}
	if (loading_status >= 4)
		main_ctx.drawImage(table_image, game_width / 2 - (table_width / 2).ratio(0,1), game_height / 2 - (table_height / 2).ratio(1,1), table_width.ratio(0,1), table_height.ratio(1,1));
	
	if (loading_status >= 7)
	{
		for (var i = 0; i < loading_cards.length; i++)
		{
			loading_cards[i].draw();
		}
	}
		
	var bar_width = 800;
	var bar_height = 100;
	
	main_ctx.globalAlpha = 0.8;
	main_ctx.fillStyle = "#000";
	main_ctx.fillRect(game_width / 2 - (bar_width / 2).ratio(0,1), game_height / 2 - (bar_height / 2).ratio(1,1), bar_width.ratio(0,1), bar_height.ratio(1,1)); 
	main_ctx.globalAlpha = 1;
	
	var percent_width = (bar_width - 4) / (loading_elements + 1) * loading_status;
	main_ctx.globalAlpha = 0.2;
	main_ctx.fillStyle = "red";
	main_ctx.fillRect(game_width / 2 - (bar_width / 2 - 2).ratio(0,1), game_height / 2 - (bar_height / 2 - 2).ratio(1,1), percent_width.ratio(0,1), (bar_height - 4).ratio(1,1)); 
	main_ctx.globalAlpha = 1;
	
	main_ctx.fillStyle = "white";
	main_ctx.textAlign = "center";
	main_ctx.textBaseline = "middle";
	main_ctx.font = (bar_height - 10).ratio(1,1) + "px Arial";
	main_ctx.fillText("Loading...", game_width / 2, game_height / 2);
}