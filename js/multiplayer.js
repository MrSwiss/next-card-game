multiplayer_table = document.getElementById("multiplayer_table").childNodes[1];

function show_hide_multiplayer_table(type)
{
	if (type != "hide")
	{
		clear_multiplayer_table();
		get_multiplayer_table();
		document.getElementById("multiplayer_table").style.display = "block";
	}
	else
	{
		document.getElementById("multiplayer_table").style.display = "none";
	}
}

function show_hide_multiplayer_new_room(type)
{
	if (type != "hide")
	{
		document.getElementById("multiplayer_new_room").style.display = "block";
	}
	else
	{
		document.getElementById("multiplayer_new_room").style.display = "none";
	}
}

function join_multiplayer_room(id)
{
	var httpobject = new XMLHttpRequest();
	httpobject.open("POST", server_url + "next_card_game.php?task=join_room&id=" + id, true);
	httpobject.onload = function ()
	{
		try
		{
			var answer = JSON.parse(httpobject.responseText);
		}
		catch(e)
		{
			alert("Couldn't Join the Room!")
		}
		
		if (answer["error"] != undefined)
		{
			alert(answer['error']);
			return false;
		}
		
		if (answer['can_join'] === true)
		{
			last_id = answer['last_id'];
			multiplayer_played_cards = [];
			
			new_game(answer['slots']-1, "multiplayer");
			if (answer['is_existing_game'] == true)
			{
				var is_existing_game = true;
				for (var i = 0; i < answer['players'].length; i++)
				{
					if (answer['players'][i]["id"] == multiplayer_id)
						is_existing_game = false;
				}
				
				if (is_existing_game)
				{
					player_num++;
					set_players_position();
					player_num--;
					
					answer['players'][answer['players'].length] = [];
					var player = answer['players'][answer['players'].length-1];
					player["id"] = multiplayer_id;
					player["name"] = multiplayer_name + " Waiting...";
				}
			}
			else
			{

				var is_existing_game = false;
			}
			
			
			var player_position = 0;
			
			if (!is_existing_game)
				player_position = get_player_position(answer);
			
			var player_key = -player_position;
			
			set_multiplayer_players(player_key, answer, is_existing_game);
			
			for (var i = 0; i < players.length; i++)
			{
				if (answer['ranks'][players[i].multiplayer_id] != undefined)
				{
					players[i].win_cards = Number(answer['ranks'][players[i].multiplayer_id]);
					console.debug("set win cards of player " + i + " to " + players[i].win_cards);
				}
			}
			
			available_cards = answer['table_cards'];
			table_cards = [];
			for (var i = 0; i < available_cards.length; i++)
			{
				table_cards[i] = new Card(available_cards[i], 0, 0, false, 0, false, false);
			}
			hide_cards();
			
			game_type = "game";
			give_player = first_player_give;
			is_giving = true;
		}
		else
			alert("Couldn't Join the Room!")
		
	}
	httpobject.send();
}

var last_id = 0;
var multiplayer_cards_to_play = [];

function handle_multiplayer()
{
	var httpobject = new XMLHttpRequest();
	httpobject.open("POST", server_url + "next_card_game.php?task=get_cards&last_id=" + last_id, true);
	httpobject.onload = function ()
	{
		played_cards = JSON.parse(httpobject.responseText);
		for (var i = 0; i < played_cards.length; i++)
		{
			last_id = played_cards[i]["id"];
			
			if (players[0].enable_multiplayer == true || players[0].multiplayer_id != played_cards[i]["player_id"])
				multiplayer_cards_to_play[multiplayer_cards_to_play.length] = played_cards[i];
		}
		
		if (multiplayer_cards_to_play.length <= 0)
			players[0].enable_multiplayer = false;
		
		window.setTimeout(handle_multiplayer, 1000);
	}
	httpobject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
	httpobject.send("played_cards=" +encodeURIComponent(JSON.stringify(multiplayer_played_cards)));
	multiplayer_played_cards = [];
}

function get_multiplayer_table()
{
	multiplayer_table.innerHTML += "<tr class='multiplayer_entry'><td colspan='3'>Bitte warten...</td></tr>";
	var httpobject = new XMLHttpRequest();
	httpobject.open("POST", server_url + "next_card_game.php?task=get_rooms", true);
	httpobject.onload = function ()
	{
		clear_multiplayer_table();
		var answer = JSON.parse(httpobject.responseText)
		var rooms = answer['rooms'];
		
		for (var key in rooms)
		{
			multiplayer_table.innerHTML += "<tr class='multiplayer_entry'>" +
				"<td>" + rooms[key]["title"] + "</td>" +
				"<td>" + rooms[key]["players"] + "/" + rooms[key]["slots"] + "</td>" +
				"<td><button onclick='join_multiplayer_room(" + rooms[key]["id"] + ")'>Join</button></td>" +
				"</tr>";
		}
		multiplayer_id = answer['id'];
		multiplayer_name = answer['name'];
	}
	httpobject.send();
}

function clear_multiplayer_table()
{
	var entries = multiplayer_table.getElementsByClassName("multiplayer_entry");
	for (var i = 0; i < entries.length; i++)
	{
		entries[i].parentNode.removeChild(entries[i]);
	}
}

function multiplayer_request_cards()
{
	cards_requested = true;
	new_cards_ready = false;
	
	var httpobject = new XMLHttpRequest();
	httpobject.open("POST", server_url + "next_card_game.php?task=request_new_cards&last_id=" + last_id, true);
	httpobject.onload = function ()
	{
		answer =  JSON.parse(httpobject.responseText);
		available_cards = answer["cards"];
		
		set_players_position();
		var player_position = get_player_position(answer);
		var player_key = -player_position;
		set_multiplayer_players(player_key, answer, false);
		
		for (var i = 0; i < players.length; i++)
		{
			if (answer['ranks'][players[i].multiplayer_id] != undefined)
			{
				players[i].win_cards = Number(answer['ranks'][players[i].multiplayer_id]);
					console.debug("set win cards of player " + i + " to " + players[i].win_cards);
			}
			else
				players[i].win_cards = false;
		}
		
		table_cards = [];
		for (var i = 0; i < available_cards.length; i++)
		{
			table_cards[i] = new Card(available_cards[i], 0, 0, false, 0, false, false);
		}
		hide_cards();
		
		cards_requested = false;
		new_cards_ready = true;
	}
	var ranks = {};
	for (var i = 0; i < players.length; i++)
	{
		ranks[players[i].multiplayer_id] = players[i].win_cards;
	}
	httpobject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
	httpobject.send("ranks=" +encodeURIComponent(JSON.stringify(ranks)));
}

function set_multiplayer_players(player_key, answer, is_existing_game)
{
	for (var i = 0; i < answer['players'].length; i++)
	{
		if (player_key < 0)
			key = players.length + player_key;
		else if (player_key >= 0)
			key = player_key + 1;
				
		if (answer['players'][i]['id'] != multiplayer_id)
		{
			if (answer['players'][i]['bot'] != true)
			{
				players[key].enable_ai = false;
				players[key].enable_multiplayer = true;
			}
			
			players[key].text = answer['players'][i]['name'];
				
			players[key].multiplayer_id = answer['players'][i]['id'];
			
			if (answer['first_player_give'] == answer['players'][i]['id'])
			{
				first_player_give = key;
				console.debug("first player: " + key);
			}
					
			player_key++;
		}
		else
		{
			players[0].text = answer['players'][i]['name'];
			
			if (is_existing_game)
			{
				players[0].disabled = true;
			}
			else
			{
				players[0].disabled = false;
			}
			players[0].enable_multiplayer = true;
			players[0].multiplayer_id = answer['players'][i]['id'];
			
			if (answer['first_player_give'] == answer['players'][i]['id'])
			{
				first_player_give = 0;
				console.debug("first player: 0");
			}
		}
	}
}

function get_player_position(answer)
{
	player_position = 0;
	
	for (var i = 0; i < answer['players'].length; i++)
	{
		if (answer['players'][i]['id'] == multiplayer_id)
			player_position = i;
	}
	
	return player_position;
}

function multiplayer_create_new_room()
{
	var title = document.getElementById("room_title").value;
	var slots = document.getElementById("room_slots").value;
	
	var httpobject = new XMLHttpRequest();
	httpobject.open("POST", server_url + "next_card_game.php?task=create_new_room", true);
	httpobject.onload = function ()
	{
		var answer = JSON.parse(httpobject.responseText);
		if (answer['error'] != undefined)
			alert(answer['error']);
		else
			join_multiplayer_room(answer['id']);
	}
	httpobject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
	httpobject.send("title=" + encodeURIComponent(title) + "&slots=" + slots);
}