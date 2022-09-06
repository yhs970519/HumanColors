// JavaScript Document

let canvas;
let ctx;
let h;  //shikiso 0-360
let s;	//saido 0-255
let b;	//meido 0-255
let addH;
let addS;
let addB;
let colors = new Array();	//irono hairetsu
let isMouseDown = false;
let page = -1;

let boxW = 200;
let boxH = 200;
let leftX = 0;
let topY = 245;
let boxTotalH = 0;
let scrollY = 0;
let tkBox;

let bar;
let title;
let subtitle;
let modoru;
let anata;
let hoka;
let menu;
let choice;
let tk;
let next;
let forms;
let formAge;
let formSex;
let toukeiColorPanel;
let toukeiText;
let toukeiColors;

let mainColorBox;
let allColorBoxes = new Array(0);	//all color boxes;
let json;

let selClass = "isSelected";

let isToukeiSelected = false;
let colorToukei;

function preload(){
	json = loadJSON("data/data.json");
}
function setup(){
	createCanvas(windowWidth, windowHeight);

	if(json){
		print(json);
		Object.keys(json).forEach(function(key){
			print(json[key]);
			let colData = json[key];	//one colorbox data
			if(colData.colors && colData.colors.length > 0){
				let colBox = new ColorBox();
				colBox.age = colData.age;
				colBox.sex = colData.sex;
				colBox.colors = colData.colors;
				allColorBoxes.push(colBox);
			}
		});
	}

	bar = document.querySelector('#bar');
	title = document.querySelector('#title');
	subtitle = document.querySelector('#subtitle');
	modoru = document.querySelector('#modoru');
	anata = document.querySelector('#anata');
	hoka = document.querySelector('#hoka');
	menu = document.querySelector('#menu');
	choice = document.querySelector('#choice');
	tk = document.querySelector('#tk');
	next = document.querySelector('#next');
	forms = document.querySelector('#forms');
	formAge = document.querySelector('#enquete-age');
	formSex = document.querySelector('#enquete-sex');
	toukeiColorPanel = document.querySelector('#toukei-color-panel');
	toukeiText = document.querySelector('#toukei-text');
	toukeiColors = document.querySelector('#toukei-colors');

	anata.style.visibility = 'hidden';
	hoka.style.visibility = 'hidden';
	choice.style.transform = 'translateX(200%)';
	toukeiColorPanel.style.visibility = 'hidden';
	toukeiColorPanel.style.width = '0';
	toukeiColorPanel.style.opacity = '0';
	toukeiColorPanel.style.transition = 'width 0.75s ease 0.5s, opacity 0s ease 1.25s, visibility 0s ease 1.25s';
	toukeiText.style.opacity = '0';
	toukeiText.style.transition = 'opacity 0.5s ease 0s, visibility 0s ease 0s';
	toukeiColors.style.opacity = '0';
	toukeiColors.style.transition = 'opacity 0.5s ease 0s, visibility 0s ease 0s';

	menu.style.color = 'black';

	next.onclick = function(){
		changePageTo(0);
		bar.style.transform = 'translateY(-300%)';
		bar.style.visibility = 'hidden';
		title.style.transform = 'translate(-50%, -400%)';
		title.style.visibility = 'hidden';
		subtitle.style.transform = 'translate(-50%, -1200%)';
		subtitle.style.visibility = 'hidden';
		anata.style.transform = 'translate(-50%, -500%)';
		anata.style.visibility = 'hidden';
		hoka.style.transform = 'translate(-50%, -500%)';
		hoka.style.visibility = 'hidden';
		menu.style.transform = 'translateX(200%)';
		menu.style.visibility = 'hidden';
		choice.style.visibility = 'hidden';
	}

	menu.onclick = function(){
		menu.style.color == 'black' ? menu.style.color = 'firebrick' :
		menu.style.color = 'black';
		choice.style.transform == 'translateX(200%)' ? choice.style.transform = 'translateX(0)' :
		choice.style.transform = 'translateX(200%)';
	}

	//フィルター項目の制御
	let choiceClick = document.querySelectorAll("#choice .click");
	choiceClick.forEach((ele) => {
		ele.onclick = function(e){
			let tar = e.target;
			if(tar.classList.contains(selClass)){
				tar.classList.remove(selClass);
			}else{
				tar.classList.add(selClass);
			}
			choiceClickChanged();
			print(tar.innerHTML);
/*
			let boxX = leftX;
			let boxY = topY;
			for(let i = 0; i < allColorBoxes.length-1; i++){
				let colBox = allColorBoxes[i];
				if(colBox.isPlaying == true){
					colBox.draw(boxX, boxY, boxW, boxH);
					boxX = boxX + boxW;
					if(boxX + boxW > width){
						boxY = boxY + boxH;
						boxX = leftX;
					}
				}
			}
			boxY += boxH;
			if(boxY > windowHeight){
				resizeCanvas(windowWidth, boxY);
			}else{
				resizeCanvas(windowWidth, windowHeight);
			}
			print(boxY);
			*/
		};
	});

	tk.onclick = function(e){
		let tar = e.target;
		if(tar.classList.contains(selClass)){
			tar.classList.remove(selClass);
			isToukeiSelected = false;
			toukeiColorPanel.style.visibility = 'hidden';
			toukeiColorPanel.style.width = '0';
			toukeiColorPanel.style.opacity = '0';
			toukeiColorPanel.style.transition = 'width 0.75s ease 0.5s, opacity 0.45s ease 0.6s, visibility 0s ease 1.25s';
			toukeiText.style.opacity = '0';
			toukeiText.style.transition = 'opacity 0.5s ease 0s, visibility 0s ease 0s';
			toukeiColors.style.opacity = '0';
			toukeiColors.style.transition = 'opacity 0.5s ease 0s, visibility 0s ease 0s';
		}else{
			tar.classList.add(selClass);
			isToukeiSelected = true;
			makeToukei();
			toukeiColorPanel.style.visibility = 'visible';
			toukeiColorPanel.style.width = '600px';
			toukeiColorPanel.style.opacity = '1';
			toukeiColorPanel.style.transition = 'width 0.75s ease 0s, opacity 0.45s ease 0s, visibility 0s ease 0s';
			toukeiText.style.opacity = '1';
			toukeiText.style.transition = 'opacity 0.5s ease 0.5s, visibility 0s ease 0s';
			toukeiColors.style.opacity = '1';
			toukeiColors.style.transition = 'opacity 0.5s ease 0.5s, visibility 0s ease 0s';
			
		}
	}
	// if(y > windowHeight){
	// 	resizeCanvas(windowWidth, y);
	// }else{
	// 	resizeCanvas(windowWidth, windowHeight);
	// }
	// print(y);
}

function draw(){
	background(255);
	colorMode(HSB, 360, 255, 255);
	if(page == 0){
		background(h, s, b);
		h = h + addH;
		if(h > 360 || h < 0){
			// addH = addH * -1;
			h = 0;
			s = s + addS;
			b = b + addB;
			if(s > 255){
				addS = 0;
				addB = -10;
			}
			if(b < 0){
				if(colors.length > 0){
					mainColorBox = new ColorBox();
					mainColorBox.colors = colors;
					mainColorBox.age = formAge.age.value;
					mainColorBox.sex = formSex.sex.value;
					let copiedBox = new ColorBox();
					copiedBox.colors = colors;
					copiedBox.age = formAge.age.value;
					copiedBox.sex = formSex.sex.value;
					allColorBoxes.push(copiedBox);
					mainColorBox.playStart();
					for(let i = 0; i < allColorBoxes.length; i++){
						let colBox = allColorBoxes[i];
						colBox.playStart();
					}
					saveJSONData();
					changePageTo(1);
					bar.style.transform = 'translateY(0)';
					bar.style.visibility = 'visible';
					title.style.transform = 'translate(-50%, 0)';
					title.style.visibility = 'visible';
					subtitle.style.transform = 'translate(-50%, 0)';
					subtitle.style.visibility = 'visible';
					modoru.style.transform = 'translate(-50%, 0)';
					modoru.style.visibility = 'visible';
					anata.style.transform = 'translate(-50%, 0)';
					anata.style.visibility = 'visible';
					hoka.style.transform = 'translate(-50%, 0)';
					hoka.style.visibility = 'visible';
					menu.style.transform = 'translateX(0)';
					menu.style.visibility = 'visible';
					choice.style.visibility = 'visible';
				}else{
					changePageTo(0);
				}
			}
		}
		if(isMouseDown == true){
			colors.push(
				{
					"h":h,
					"s":s,
					"b":b
				}
			);
		}
	}
	leftX = width/2 + width/15;
	if(page == 1){
		mainColorBox.repeatMode = true;
		mainColorBox.draw(0, 0, width/2, height);
		if(boxTotalH > height){
			if(scrollY >  0){
				scrollY = 0;
			}
			let scrollMinY = -(boxTotalH - (height - topY));
			if(scrollY <  scrollMinY){
				scrollY = scrollMinY;
			}	
		}
		let boxX = leftX;
		let boxY = topY;
		for(let i = 0; i < allColorBoxes.length-1; i++){
			let colBox = allColorBoxes[i];
			if(colBox.isPlaying == true){
				colBox.repeatMode = true;
				colBox.draw(boxX, boxY + scrollY, boxW, boxH);
				boxX = boxX + boxW;
				if(boxX + boxW > width){
					boxY = boxY + boxH;
					boxX = leftX;
				}
			}
		}
		boxTotalH = boxY  + boxH -  topY;

		// if(y > windowHeight){
		// 	resizeCanvas(windowWidth, y);
		// }else{
		// 	resizeCanvas(windowWidth, windowHeight);
		// }
		// print(y);
		/*
		let panelW = 600;
		let panelH = 600;
		let leftXX = width/2 - panelW/2;
		let topYY = height/1.6 - panelH/2;
		let xx = leftXX;
		let yy = topYY;
		let ww = 40;
		let hh = 40;
		if(isToukeiSelected == true){
			fill(240, 4, 255);
			rect(width/2 - 375, height/1.675 - 375, 750, 750);
			fill(0, 255, 0);
			textSize(16);
			textAlign(CENTER, CENTER);
			text('今までの測定で「人を感じる色」として選ばれた色の中で、最も多くの人が選んだ上位255色です。', width/2 - 375, height/1.675 - 400, 750, 200);
			for(let i = 0; i < colorToukei.length; i++){
				let col = colorToukei[i].color;
				let tou = colorToukei[i].toukei;
				let divBox = document.createElement("div");
				let idNode = document.createAttribute("id");
				idNode.value = 'tkBox' + i + '';
				divBox.setAttributeNode(idNode);
				document.querySelector("main").appendChild(divBox);
				window["tkBox" + i] = document.querySelector('#tkBox' + i + '')
				window["tkBox" + i].style.top = xx;
				window["tkBox" + i].style.left = yy;
				window["tkBox" + i].style.width = ww;
				window["tkBox" + i].style.height = hh;
				window["tkBox" + i].style.backgroundColor = HSVtoRGB(col.h, col.s, col.b);
				// fill(col.h, col.s, col.b);
				// tkBox = rect(xx, yy, ww, hh);
				// tkBox;
				// tkBox.mouseOver(offOpacity);
				// tkBox.mouseOut(onOpacity);
				fill(0, 255, 0);
				textSize(10);
				textAlign(CENTER, CENTER);
				text(tou, xx, yy, ww, hh);
				xx += ww;
				//パネルの右枠からはみだしたら開業する
				if(xx + ww > width/2 + panelW/2){
					xx = leftXX;
					yy += hh;
				}
				//パネルの下枠からはみだしたらやめる
				if(yy + hh > height/1.6 + panelH/2){
					break;
				}
			}
		}
		*/
	}
	/*
	let arr = {
	"name":"yang",
	"age":"20"
};
*/
}

function changePageTo(thePage){
	page = thePage;
	if(page == 0){
		h = 0;  //shikiso 0-360
		s = 0;	//saido 0-255
		b = 255;	//meido 0-255
		addH = 1;
		addS = 10;
		addB = 0;
		colors = new Array();	//irono hairetsu
		isMouseDown = false;
		forms.style.opacity = '0';
		forms.style.visibility = 'hidden';
		menu.style.color = 'black';
		choice.style.transform = 'translateX(200%)';
		menu.style.color = 'black';
	}else if(page == 1){

	}else if(page == 2){

	}
}

function mousePressed(){
	isMouseDown = true;
}

function mouseReleased(){
	isMouseDown = false;
}
function mouseWheel(e){
	scrollY += e.delta;
}

function saveJSONData(){
	let outputData = {fileName:"data.json", colorData:[]};
	for(let i = 0; i < allColorBoxes.length; i++){
		let col = allColorBoxes[i];
		outputData["colorData"].push({age:col.age, sex:col.sex, colors:col.colors});
	}

	print(outputData);
	httpPost("./saver.php", "json", outputData, function(res){
		print(res);
		//	  isLoading = false;
	});
}

//フィルター項目が変化した時
function choiceClickChanged(){
	let survivedBoxes = allColorBoxes.concat();	//配列をコピー
	//allColorBoxexの再生切り替えを行う
	//age
	survivedBoxes = filterBoxes(survivedBoxes, "age", selClass);
	//sex
	survivedBoxes = filterBoxes(survivedBoxes, "sex", selClass);
	print(survivedBoxes);
	//表示の切り替え
	for(let i = 0; i < allColorBoxes.length; i++){
		let colBox = allColorBoxes[i];
		colBox.isPlaying = false;
		for(let j = 0; j < survivedBoxes.length; j++){
			if(colBox == survivedBoxes[j]){
				colBox.isPlaying = true;
			}
		}
	}
	// if(y > windowHeight){
	// 	resizeCanvas(windowWidth, y);
	// }else{
	// 	resizeCanvas(windowWidth, windowHeight);
	// }
	// print(y);
}
function filterBoxes(boxes, choiceName, selClass){
	if(!document.querySelector('#' + choiceName + ' .' + selClass)){
		//何も選ばれていなかったら、何もしない
	}else{
		//何か選ばれていたら、マッチングを行う
		for(let i = 0; i < boxes.length; i++){
			let box = boxes[i];
			let isMatched = false;
			let choice = document.querySelectorAll('#' + choiceName + " .click");
			choice.forEach((ele) => {
				if(ele.classList.contains(selClass)){
					let value = ele.innerHTML.toLowerCase();	//選ばれているフィルター項目の名前
					if(value == box[choiceName]){
						isMatched = true;
					}
				}
			});
			if(isMatched == false){
				boxes.splice(i, 1);	//配列から要素を削除する
				i = i - 1;
			}
		}
	}
	return boxes;
}
function makeToukei(){
	if(allColorBoxes.length > 0){
		colorToukei = new Array(0);
		//集計
		for(let i = 0; i < allColorBoxes.length; i++){
			let box = allColorBoxes[i];
			for(let j = 0; j < box.colors.length; j++){
				let col = box.colors[j];
				let isMatched = false;
				for(let k = 0; k < colorToukei.length; k++){
					if(colorToukei[k].color.h == col.h && colorToukei[k].color.s == col.s && colorToukei[k].color.b == col.b){
						isMatched = true;
						colorToukei[k].toukei ++;
					}
				}
				if(!isMatched){
					colorToukei.push({
						color:col,
						toukei:1
					})
				}
			}
		}
		//ソート
		colorToukei = sortToukei(colorToukei);
		makeToukeiPanel();
		print(colorToukei);
	}
}
function makeToukeiPanel(){
		let box = document.querySelector("#toukei-colors");
		box.innerHTML = "";	//一度中身を空にする
		colorMode(HSB);
		let num = min(100, colorToukei.length);	//色の数と100の少ない方でfor文を止める
		for(let i = 0; i < num; i++){
			let col = colorToukei[i];
			let li = document.createElement("li");
			li.classList.add("toukei-color");
			box.appendChild(li);
			//統計の色の値をHSB→RGBに変換し、liの背景色に設定する
			let c = color(col.color.h, col.color.s, col.color.b);
			li.style.background = 'rgb(' + red(c) + ',' + green(c) + ',' + blue(c) + ')';
			//投票された数を文字として入れる
			let p = document.createElement("p");
			p.classList.add("toukei-color-number");
			p.innerHTML = col.toukei + '人';
			li.appendChild(p);
			//投票数、色を"data-"属性に入れる（hover時に使いたければ使う）
			li.setAttribute("data-toukei-value", col.toukei);
			li.setAttribute("data-toukei-color", col.color);

			let toukeiCn = document.querySelectorAll(".toukei-color-number");
			let toukeiC = document.querySelectorAll(".toukei-color");
			$(toukeiC[i]).hover(function() {
				$(this).css('background-color', 'rgb(' + red(c) + ',' + green(c) + ',' + blue(c) + ', 0.4)');
				$(toukeiCn[i]).css('opacity', '1');
			}, function() {
				$(this).css('background-color', 'rgb(' + red(c) + ',' + green(c) + ',' + blue(c) + ', 1)');
				$(toukeiCn[i]).css('opacity', '0');
			});
		};
}

function sortToukei(colToukei){
	colToukei.sort(function(a, b) {
		let valueA = a.toukei;
		let valueB = b.toukei;
		if(valueA == valueB){
			return 0;
		} else if (valueA < valueB) {
			return 1;
		} else {
			return -1;
		}
	});
	return colToukei;
}

// function offOpacity(){
// 	tkBox.fill(col.h, col.s, col.b, 0.4);
// 	rect(xx, yy, ww, hh)
// }

// function onOpacity(){
// 	tkBox.fill(col.h, col.s, col.b, 1);
// 	rect(xx, yy, ww, hh)
// }

// function HSVtoRGB(h, s, v) {
//     var r, g, b, i, f, p, q, t;
//     if (arguments.length === 1) {
//         s = h.s, v = h.v, h = h.h;
//     }
//     i = Math.floor(h * 6);
//     f = h * 6 - i;
//     p = v * (1 - s);
//     q = v * (1 - f * s);
//     t = v * (1 - (1 - f) * s);
//     switch (i % 6) {
//         case 0: r = v, g = t, b = p; break;
//         case 1: r = q, g = v, b = p; break;
//         case 2: r = p, g = v, b = t; break;
//         case 3: r = p, g = q, b = v; break;
//         case 4: r = t, g = p, b = v; break;
//         case 5: r = v, g = p, b = q; break;
//     }
//     return {
//         r: Math.round(r * 255),
//         g: Math.round(g * 255),
//         b: Math.round(b * 255)
//     };
// }
