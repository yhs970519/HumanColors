class ColorBox {
	constructor(){
		this.age = "";
		this.sex = "";
		this.colors = new Array();
		this.n = 0;	//iro no bangou
		this.isPlaying = false;
		this.repeatMode = false;
	}
	playStart(){
		this.isPlaying = true;
		this.n = 0;
	}
	draw(x, y, w, h){
		if(this.isPlaying == true){
			if(this.n <= this.colors.length-1){
				let col = this.colors[this.n];
				fill(col.h, col.s, col.b);
				noStroke();
				rect(x, y, w, h);
				this.n = this.n + 1;
			}else{
				if(this.repeatMode == true){
					this.n = 0;
				}else{
					this.isPlaying = false;
				}
			}
		}
	}
}
