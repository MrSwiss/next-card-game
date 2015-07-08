table_width = 520;
table_height = 440;

highlight = 0;

function new_game(num, type)
{
	if (type == "multiplayer")
		is_multiplayer = true;
	else
		is_multiplayer = false;
	is_menu = false;
	
	if (!is_multiplayer)
		game_type = "game";
	
	if (is_multiplayer)
		available_cards = [];
	else
		available_cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	
	available_card_num = available_cards.length;
	cards_played = 0;
	cards_requested = false;
	new_cards_ready = false;
	
	player_num = num + 1;
	players = [];
	player_turn = 0;
	skipped_players = [];
	finished_players = [];
	can_play = false;

	first_player_give = 0;
	game_finished = false;
	ai_speed = "auto";
	is_giving = false;
	give_timeout = 0;
	give_player = first_player_give;
	
	table_cards = [];
	for (var i = 0; i < available_cards.length; i++)
	{
		table_cards[i] = new Card(available_cards[i], 0, 0, false, 0, false, false);
	}
	hide_cards();
	
	var test_player = new Player(0,0,0,0,true);
	
	for (i = 0; i < player_num; i++)
	{
		if (i == 0)
			var drawX = - test_player.width / 2;
		else if (i >= 1 && i <= 2)
			var drawX = -table_width / 2 - test_player.width / 2 - 100;
		else if (i >= 3 && i <= 4)
			var drawX = -table_width / 2 - 200 - test_player.width / 2 + (i-2)*300;
		else
			var drawX = table_width / 2 + 40;

		
		if (i == 0)
			var drawY = original_height / 2 + table_width / 2 + 20;
		else if (i >= 1 && i <= 2)
			var drawY = original_height / 2 - table_height / 2 + 200 - (i-1)*200 + 70;
		else if (i >= 3 && i <= 4)
			var drawY = original_height / 2 - table_width / 2 - test_player.width - 20;
		else
			var drawY = original_height / 2 - table_height / 2 + (i-5)*200 + 70;

	
		
		if (i == 0)
			show_cards = true;
		else
			show_cards = false;
		
		if (i == 0)
			card_pos = "bottom";
		else if (i == 1 || i == 2)
			card_pos = "left";
		else if (i == 3 || i == 4)
			card_pos = "top";
		else
			card_pos = "right";
		
		players[i] = new Player(drawX, drawY, show_cards, card_pos, false, i);
	}
	
	camera = new Camera(true);
	redraw_canvas = true;
	
	if (is_multiplayer == false)
		is_giving = true;
	
	if (is_multiplayer)
		handle_multiplayer();
}
function game()
{
	if (redraw_canvas == true)
		bg_ctx.drawImage(background_image, 0,0,original_width, original_height, 0,0, game_width, game_height);
	
	//camera.pre();
	
	if (is_giving)
	{
		if (give_timeout <= 0)
			give_cards(give_player);
		else
			give_timeout -= (1).speed();
	}
	
	if (game_finished == true && !is_giving && !cards_requested)
	{
		if (finish_timeout <= 0)
		{
			if (is_multiplayer && !new_cards_ready)
			{
				table_cards = [];
				multiplayer_request_cards();
			}
			else if (is_multiplayer)
				new_cards_ready = false;
			
			if (table_cards.length > 0)
			{
				finished_players = [];
				skipped_players = [];
				can_play = false;
				hide_cards();
				give_player = first_player_give;
				is_giving = true;
			}
		}
		else
			finish_timeout -= (1).speed();
	}
	else if (!is_giving)
	{
		if (finished_players.length == player_num-1)
		{
			if (first_player_give < player_num -1)
				first_player_give++;
			else
				first_player_give = 0;
			
			game_finished = true;
			finish_timeout = 200;
			
			console.debug("game finished");
			for (var i = 0; i < players.length; i++)
			{
				if (finished_players.indexOf(i) === -1)
				{
					for (var ii = 0; ii < players[i].cards.length; ii++)
					{
						players[i].cards[ii].play(true, -200 + 100*ii, false, true);
					}
				}
			}
			
			can_play = false;
		}
		
		if (finished_players.indexOf(player_turn) !== -1)
		{
			if (skipped_players.indexOf(player_turn) === -1)
				skipped_players[skipped_players.length] = player_turn;
		}
		
		if (skipped_players.indexOf(player_turn) !== -1)
		{
			for (var i = 0; i < player_num; i++)
			{
				if (player_turn < player_num - 1)
					player_turn++;
				else
					player_turn = 0;
				
				if (skipped_players.indexOf(player_turn) === -1)
					break;
			}
		}
		
		if (table_cards.length > 0 && finished_players.indexOf(table_cards[table_cards.length-1].from_player) !== -1)
		{
			for (var i = 0; i < player_num; i++)
			{
				if (table_cards[table_cards.length-1].from_player < player_num-1)
					table_cards[table_cards.length-1].from_player++;
				else
					table_cards[table_cards.length-1].from_player = 0;
				
				if (finished_players.indexOf(table_cards[table_cards.length-1].from_player) === -1)
					break;
			}
		}
		
		if (table_cards.length > 0 && skipped_players.length >= player_num - 1)
		{
			console.debug(skipped_players.length + " Players skipped the round");
			hide_cards();
			player_turn = table_cards[table_cards.length - 1].from_player;
		}
	}
	main_ctx.drawImage(table_image, game_width / 2 - (table_width / 2).ratio(0,1), game_height / 2 - (table_height / 2).ratio(1,1), table_width.ratio(0,1), table_height.ratio(1,1));
	
	
	for (var i = 0; i < table_cards.length; i++)
	{
		table_cards[i].draw();
	}
	
	if (is_multiplayer && multiplayer_cards_to_play.length > 0 && players[0].enable_multiplayer)
	{
		for (var i = 0; i < players.length; i++)
		{
			players[i].draw();
			for (var ii = 0; ii < 10; ii++)
			{
				for (var iii = 0; iii < players[i].cards.length; iii++)
				{
					players[i].cards[iii].draw();
				}
			}
		}
	}
	else
	{
		for (var i = 0; i < players.length; i++)
		{
			players[i].draw();
		}
	}
	
	
	
	
	//camera.post();
}

function give_cards(player_id)
{
	if (player_id == "switch")
	{
		handle_card_switch();
		is_giving = false;
		return false;
	}
	console.debug("give");
	is_giving = true;
	
	can_play = false;
	
	var player = players[player_id];
	
	var test_card = new Card(0,0,0, player.show_cards);
	var card_num = available_card_num / player_num;

	if (player.card_pos == "top" || player.card_pos == "bottom")
		var drawX = player.drawX - (card_num*test_card.width) / 2 + test_card.width*player.cards.length + player.width / 2;
	else if (player.card_pos == "left")
		var drawX = player.drawX - test_card.width - test_card.width*player.cards.length;
	else
		var drawX = player.drawX + player.width + test_card.width*player.cards.length;
			
	if (player.card_pos == "top")
		var drawY = player.drawY - test_card.height;
	else if (player.card_pos == "bottom")
		var drawY = player.drawY + player.height;
	else
		var drawY = player.drawY + player.height / 2 - test_card.height / 2;
			
	if (is_multiplayer == false)
		var card_key = Math.round(Math.random()*(table_cards.length - 1));
	else
		var card_key = table_cards.length - 1;
	
	if (card_key < 0)
		console.warn("Unknown Cardkey: " + card_key);
	
	player.cards[player.cards.length] = new Card(table_cards[card_key].id, table_cards[card_key].drawX, table_cards[card_key].drawY, player.show_cards, 0, player.key, player.cards.length);
	
	if (table_cards[card_key].id == 0)
		player_turn = player_id;
		
	table_cards.splice(card_key, 1);
	player.updated_cards();
	
	if (table_cards.length > 0)
	{
		if (players[player_id + 1] != undefined)
			give_player = player_id + 1;
		else
			give_player = 0;
		
		if (!is_multiplayer || multiplayer_cards_to_play.length <= 0)
			give_timeout = 10;
	}
	else
	{
		give_player = "switch";
		if (!is_multiplayer || multiplayer_cards_to_play.length <= 0)
			give_timeout = 100;
	}
}

function handle_card_switch()
{
	card_players = [];
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].win_cards === 2)
			card_players["win2"] = players[i];
		else if (players[i].win_cards === 1)
			card_players["win1"] = players[i];
		else if (players[i].win_cards === -1)
			card_players["give1"] = players[i];
		else if (players[i].win_cards === -2)
			card_players["give2"] = players[i];
	}
	
	if (card_players["win2"] != undefined && card_players["give2"] != undefined)
	{
		console.debug("switch cards");
		card_players["win2"].cards.sort(compare_card);
		card1 = card_players["win2"].cards[card_players["win2"].cards.length-1];
		card2 = card_players["win2"].cards[card_players["win2"].cards.length-2];
		card1.disabled = true;
		card2.disabled = true;
		
		card_players["give2"].cards[card_players["give2"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["give2"].show_cards);
		if (card1.id == 0)
			player_turn = card_players["give2"].key;
		
		card_players["give2"].cards[card_players["give2"].cards.length] = new Card(card2.id, card2.drawX, card1.drawY, card_players["give2"].show_cards);
		
		if (card2.id == 0)
			player_turn = card_players["give2"].key;
		
		card_players["give2"].cards.sort(compare_card);
		card1 = card_players["give2"].cards[0];
		card2 = card_players["give2"].cards[1];
		card1.disabled = true;
		card2.disabled = true;
		
		card_players["win2"].cards[card_players["win2"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["win2"].show_cards);
		if (card1.id == 0)
			player_turn = card_players["win2"].key;
		
		card_players["win2"].cards[card_players["win2"].cards.length] = new Card(card2.id, card2.drawX, card1.drawY, card_players["win2"].show_cards);
		
		if (card2.id == 0)
			player_turn = card_players["win2"].key;
		
		card_players["win2"].updated_cards();
		card_players["give2"].updated_cards();
		
		if (card_players["win1"] != undefined && card_players["give1"] != undefined)
		{
			card_players["win1"].cards.sort(compare_card);
			card1 = card_players["win1"].cards[card_players["win1"].cards.length-1];
			card1.disabled = true;
			
			card_players["give1"].cards[card_players["give1"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["give1"].show_cards);
			if (card1.id == 0)
				player_turn = card_players["give1"].key;
			
			card_players["give1"].cards.sort(compare_card);
			card1 = card_players["give1"].cards[0];
			card1.disabled = true;
			
			card_players["win1"].cards[card_players["win1"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["win1"].show_cards);
			if (card1.id == 0)
				player_turn = card_players["win1"].key;
			
			card_players["win1"].updated_cards();
			card_players["give1"].updated_cards();
		}
	}
	else
		console.debug("No cards to switch!")

	finished_players = [];
	skipped_players = [];
	game_finished = false;
	can_play = true;
}