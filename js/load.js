
function load_media()
{
	/*
	ground_images = new Array();
	for (var i in ground_names)
	{
		ground_images[i] = new Image();
		ground_images[i].src = "js/images/ground/" + ground_img_names[i];
	}
	*/
	
	background_image = new Image();
	background_image.src = "js/images/game_background.png";
	
	card_image = new Image();
	card_image.src = "js/images/cards.png";
	
	suits_image = new Image();
	suits_image.src = "js/images/suits.png";
	
	player_image = new Image();
	player_image.src = "js/images/player.png";
	
	table_image = new Image();
	table_image.src = "js/images/table.png";
	
	skip_image = new Image();
	skip_image.src = "js/images/skip.png";
	
	arrow_image = new Image();
	arrow_image.src = "js/images/arrow_down.png";
	
	cards_image = [];
	for (var i = 0; i <= 31; i++)
	{
		cards_image[i] = new Image();
		cards_image[i].src = "js/images/cards/" + i + ".png";
	}
}