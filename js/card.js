function Card(id, drawX, drawY, show, rotate, player_id, key)
{
	var symbols = ["heart", "diamond", "club", "spade"];
	
	this.show = show;
	this.is_moving = false;
	this.player_id = player_id;
	this.drawX = drawX;
	this.drawY = drawY;
	this.error = false;
	this.key = key;
	
	this.rotate = rotate;
	if (this.rotate == undefined)
		this.rotate = 0;

	this.disabled = false;
	
	this.original_width = 100;
	this.original_height = 136;
	
	if (this.show == false)
	{
		this.width = this.original_width / 2;
		this.height = this.original_height / 2;
	}
	else
	{
		this.width = this.original_width;
		this.height = this.original_height;
	}
	
	this.srcWidth = 200;
	this.srcHeight = 272;
	
	if (this.show)
		this.srcX = 200;
	else
		this.srcX = 0;
	
	this.srcY = 0;
	
	this.id = id;
	if (this.id >= 0 && this.id < 4)
	{
		this.name = "7";
		this.num = 7;
		this.symbol = symbols[this.id];
	}
	else if (this.id >= 4 && this.id < 8)
	{
		this.name = "8";
			this.num = 8;
		this.symbol = symbols[this.id - 4];
	}
	else if (this.id >= 8 && this.id < 12)
	{
		this.name = "9";
		this.num = 9;
		this.symbol = symbols[this.id - 8];
	}
	else if (this.id >= 12 && this.id < 16)
	{
		this.name = "10";
		this.num = 10;
		this.symbol = symbols[this.id - 12];
	}
	else if (this.id >= 16 && this.id < 20)
	{
		this.name = "jack";
		this.num = 11;
		this.symbol = symbols[this.id - 16];
	}
	else if (this.id >= 20 && this.id < 24)
	{
		this.name = "queen";
		this.num = 12;
		this.symbol = symbols[this.id - 20];
	}
	else if (this.id >= 24 && this.id < 28)
	{
		this.name = "king";
		this.num = 13;
		this.symbol = symbols[this.id - 24];
	}
	else if (this.id >= 28 && this.id < 32)
	{
		this.name = "ace";
		this.num = 14;
		this.symbol = symbols[this.id - 28];
	}
	
	this.symbol_srcWidth = 34;
	this.symbol_srcHeight = 38;
	this.symbol_width = 34;
	this.symbol_height = 38;
	
	if (this.symbol == "club")
		this.symbol_srcX = 78;
	else if (this.symbol == "diamond")
		this.symbol_srcX = 39;
	else if (this.symbol == "spade")
		this.symbol_srcX = 0;
	else
		this.symbol_srcX = 118;
	
	this.symbol_srcY = 0;
	this.hide_old_cards = false;
	
}
Card.prototype.draw = function()
{
	if (this.disabled == false)
	{
		main_ctx.save();
		main_ctx.translate(this.drawX.ratio(0) + (this.width/2).ratio(0,1), this.drawY.ratio(1) + (this.height/2).ratio(1,1));
		main_ctx.rotate(Math.PI / this.rotate);
		
		// blank card
		main_ctx.drawImage(cards_image, this.srcX, this.srcY, this.srcWidth, this.srcHeight, (-this.width / 2).ratio(0,1), (-this.height/ 2).ratio(1,1), this.width.ratio(0,1), (this.height).ratio(1,1));
		
		if (this.show)
		{
			// suit / symbol
			main_ctx.drawImage(suits_image, this.symbol_srcX, this.symbol_srcY, this.symbol_srcWidth, this.symbol_srcHeight, -(this.symbol_width / 2).ratio(0,1), -(this.symbol_height / 2).ratio(1,1), this.symbol_width.ratio(0,1), this.symbol_height.ratio(1,1));
			
			// name
			if (this.symbol == "heart" || this.symbol == "diamond")
				main_ctx.fillStyle = "#a31919";
			else
				main_ctx.fillStyle = "black";
		}
		if ((!this.is_moving || this.moving_action == "fix") && player_turn == this.player_id && can_play && (highlight == this.player_id + "" + this.key || mouseX >= (this.drawX).ratio(0) && mouseX <= (this.drawX).ratio(0) + (this.width).ratio(0,1) && mouseY >= (this.drawY).ratio(1) && mouseY <= (this.drawY).ratio(1) + (this.height).ratio(1,1)))
		{
			main_ctx.globalAlpha = 0.3;
			main_ctx.fillStyle = "red";
			main_ctx.fillRect(-(this.width / 2).ratio(0,1), (-this.height / 2).ratio(1,1), this.width.ratio(0,1), this.height.ratio(1,1));
			main_ctx.globalAlpha = 1;
			
			if (mouse_is_down)
			{
				if (table_cards.length == 0 && this.num == 7 || table_cards.length > 0 && table_cards[table_cards.length-1].done == true)
					this.play();
				else if (table_cards.length > 0 && table_cards[table_cards.length-1].num < this.num && players[this.player_id].selected_cards == cards_played)
					this.play();
				else
					this.error = 50;
				
				mouse_is_down = false;
			}
			
			if (highlight == "" && players[this.player_id] != undefined)
				players[this.player_id].selected_cards = 1;
			
			if (players[this.player_id] != undefined && players[this.player_id].cards[this.key+1] != undefined && players[this.player_id].cards[this.key+1].num == this.num)
			{
				players[this.player_id].selected_cards++;
				highlight = this.player_id + "" + (this.key+1);
			}
			else
				highlight = "";
		}
		if (this.error !== false)
		{
			this.error -= (1).speed();
			if (this.error <= 0)
				this.error = false;
			
			
			main_ctx.fillStyle = "red";
			main_ctx.textBaseline = "middle";
			main_ctx.textAlign = "center";
			main_ctx.font = (50).ratio(0,1) + "px Arial";
			main_ctx.fillText("X", (0).ratio(0,1), (0).ratio(1,1));
		}
		
		if (this.show)
		{
			//name
			main_ctx.textBaseline = "top";
			main_ctx.textAlign = "left";
			main_ctx.font = (15).ratio(0,1) + "px Arial";
			main_ctx.fillText(this.name, -(this.width / 2 - 5).ratio(0,1), -(this.height / 2 - 5).ratio(1,1));
		}
		
		if (this.is_moving)
		{
			if (this.moving_action == "fix")
			{
				this.diffX = this.newDrawX  - this.drawX;
				this.diffY = this.newDrawY - this.drawY;
			}
			else
			{
				this.diffX = this.newDrawX  - this.drawX + this.width / 2;
				this.diffY = this.newDrawY - this.drawY + this.height / 2;
			}
			
			this.speed = (Math.abs(this.diffX) + Math.abs(this.diffY)) / 20;
			this.angle = Math.atan2(this.diffY, this.diffX);
			this.drawX += Math.cos(this.angle) * this.speed.speed();
			this.drawY += Math.sin(this.angle) * this.speed.speed();
			
			this.rotateSpeed = (this.newRotate - this.rotate) / 100;
			this.rotate += this.rotateSpeed.speed();
			
			if (this.speed < 1 && this.moving_action !== "fix" || this.speed <= 0.1)
			{
				this.is_moving = false;
				
				if (this.player_id !== false && this.moving_action !== "fix")
				{
					players[this.player_id].played_card = false;
					this.disabled = true;
					table_cards[table_cards.length] = new Card(this.id, this.drawX, this.drawY, true, this.rotate, false);
					table_cards[table_cards.length-1].from_player = this.player_id;
					
					var no_update = false;
					for (var i = 0; i < players[this.player_id].cards.length; i++)
					{
						if (players[this.player_id].cards[i].is_moving && players[this.player_id].cards[i].moving_action != "fix")
							no_update = true;
					}
					if (no_update == false)
					{
						var player_id = this.player_id;
						players[this.player_id].updated_cards();
						can_play = true;
						if (this.hide_old_cards)
							hide_cards();
					}
				}
				else if (this.moving_action == "fix")
				{
					this.drawX = this.newDrawX;
					this.drawY = this.newDrawY;
					this.rotate = this.newRotate;
				}
			}
		}
		
		main_ctx.restore();
	}
};

Card.prototype.play = function(no_new_turn, offsetX, is_ai)
{	
	if (is_ai === true)
	{
		var card = this;
		if (ai_speed == "auto")
			var timeout = Math.round(Math.random()*2000);
		else
			var timeout = ai_speed;
		
		window.setTimeout(function() { card.play(no_new_turn, offsetX, false) }, timeout);
		return false;
	}
	
	players[this.player_id].played_card = false;
	
	if (is_ai != "2" && (table_cards.length == 0 || table_cards[table_cards.length-1].done == true))
		cards_played++;
	
	if (offsetX == undefined)
		offsetX = 0;
	
	if (players[this.player_id].cards[this.key+1] != undefined && players[this.player_id].cards[this.key+1].num == this.num)
	{
		if (offsetX == 0)
			offsetX-= 99;
		players[this.player_id].cards[this.key+1].play(true, offsetX+100);
	}
	
	this.is_moving = true;
	this.moving_action = false;
	can_play = false;
	this.newDrawX = 0 - this.width + offsetX;
	this.newDrawY = original_height / 2 - this.height;
	this.newRotate = Math.round(Math.random()*20);
	this.show = true;
	this.width = this.original_width;
	this.height = this.original_height;
	this.srcX = 200;
	this.show = true;
	
	if (this.id >= 28)
	{
		this.hide_old_cards = true;
	}
	else if (no_new_turn !== true)
	{
		for (var i = 0; i < player_num; i++)
		{
			if (player_turn < player_num - 1)
				player_turn++;
			else
				player_turn = 0;
			
			if (skipped_players.indexOf(player_turn) == -1)
				break;
		}
	}
};

function hide_cards()
{
	skipped_players = [];
	skipped_players = [];
	
	console.debug("new Round!");
	
	cards_played = 0;
	var card = new Card(0,0,0, true);
	for (var i = 0; i < table_cards.length; i++)
	{
		table_cards[i].is_moving = true;
		table_cards[i].newDrawX = -table_width / 2;
		table_cards[i].newDrawY = original_height / 2 - table_height / 2 + card.height;
		table_cards[i].newRotate = 360;
		table_cards[i].show = false;
		table_cards[i].width = card.original_width / 2;
		table_cards[i].height = card.original_height / 2;
		table_cards[i].srcX = 0;
		table_cards[i].done = true;
	}
	
	for (var i = 0; i < players.length; i++)
	{
		players[i].skipped = false;
	}
}
