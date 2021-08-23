let heightNode = 10;
let widthNode = 0;
let LADDER = {};
let row = 0;
let ladder = $('#ladder');
let ladder_canvas = $('#ladder_canvas');
let working = false;
let userName = "";
let lineColor = "#ddd";
let delayTime = 100;

const GLOBAL_FOOT_PRINT = {};
const GLOBAL_CHECK_FOOT_PRINT = {};

$(function(){
  $('#button').on('click', ()=>{
    let member = $('input[name=member]').val();
    if(member < 2){
      return alert('최소 2명 이상 선택하세요.');
    }
    if(member > 20){
      return alert('너무 많아요.. ㅠㅠ');
    }
    $('#landing').css({
      'opacity': 0
    });
    widthNode = member;
    setTimeout(function(){
      $('#landing').remove();
      init();
    }, 310);
  });

  let settingFg = false;
  $(document).on('click', 'button.ladder-start', (e)=>{

    let firstName = $('#firstName').val();
    let oneLatter = firstName.charAt(firstName.length-1);

    //첫글자에 공백 포함되면 사기치기
    if(oneLatter == ' ' && !settingFg){
      reSetCheckFootPrint();
      let _this = $(e.target);
      let node = _this.attr('data-node');
      
      let loopFg = true;
      while(loopFg){
        let result = checkResult(node);
        console.log(`result:${result}!`)
        if(result==0){
          console.log(`break....`)
          break;
        }else{
          ladder.css({
            'width': (widthNode-1) * 100 + 6,
            'height': (heightNode-1) * 25 + 6,
            'background-color': '#fff'
          });
        
          ladder_canvas
          .attr('width', (widthNode-1) * 100 + 6)
          .attr('height', (heightNode-1) * 25 + 6);
          
          setDefaultFootPrint();
          reSetCheckFootPrint();
          setDefaultRowLine();
          drawDefaultLine();
          setRandomNodeData();
          drawNodeLine();
        }
      }
      settingFg = true;
    }

    if(working){
      return false;
    }
    $('.dim').remove();
    working = true;
    reSetCheckFootPrint();
    let _this = $(e.target);
    _this.attr('disabled', true).css({
      'color': '#000',
      'border': '1px solid #F2F2F2',
      'opacity': '0.3'
    })
    let node = _this.attr('data-node');
    let color = _this.attr('data-color');
    startLineDrawing(node, color);
    userName = $('input[data-node="' + node + '"]').val();
  });
});

const init = ()=>{
  ladder.css({
    'width': (widthNode-1) * 100 + 6,
    'height': (heightNode-1) * 25 + 6,
    'background-color': '#fff'
  });

  ladder_canvas
  .attr('width', (widthNode-1) * 100 + 6)
  .attr('height', (heightNode-1) * 25 + 6);

  setDefaultFootPrint();
  reSetCheckFootPrint();
  setDefaultRowLine();
  drawDefaultLine();
  setRandomNodeData();
  drawNodeLine();
  userSetting();
  resultSetting();
};

const setDefaultFootPrint = ()=>{
  for(let r=0; r<heightNode; r++){
    for(let column=0; column<widthNode; column++){
      GLOBAL_FOOT_PRINT[column + "-" + r] = false;
    }
  }
};

const reSetCheckFootPrint = ()=>{
  for(let r=0; r<heightNode; r++){
    for(let column=0; column<widthNode; column++){
      GLOBAL_CHECK_FOOT_PRINT[column + "-" + r] = false;
    }
  }
};

const setDefaultRowLine = ()=>{
  for(let y=0; y<heightNode; y++){
    let rowArr = [];
    for(let x=0; x<widthNode; x++){
      let node = x + "-" + row;
      rowArr.push(node);
      //노드 그리기
      let left = x * 100;
      let top = row * 25;
      node = $('<div></div>')
      .attr('class', 'node')
      .attr('id', node)
      .attr('data-left', left)
      .attr('data-top', top)
      .css({
        'position': 'absolute',
        'left': left,
        'top': top
      });
      ladder.append(node);
    }
    LADDER[row] = rowArr;
    row++;
  }
};

const drawDefaultLine = ()=>{
  let html = '';
  html += '<table>';
  for(let y=0; y<heightNode-1; y++){
    html += '<tr>';
    for(let x=0; x<widthNode-1; x++){
      html += '<td style="width:98px; height:25px; border-left:2px solid ' + lineColor + '; border-right:2px solid ' + lineColor + ';"></td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  ladder.append(html);
};

const setRandomNodeData = ()=>{
  for(let y=0; y<heightNode; y++){
    for(let x=0; x<widthNode; x++){
      let loopNode = x + "-" + y;
      let rand = Math.floor(Math.random() * 2);
      if(rand == 0){
        GLOBAL_FOOT_PRINT[loopNode] = {"change": false, "draw": false};
      }else{
        if(x == (widthNode - 1)){
          GLOBAL_FOOT_PRINT[loopNode] = {"change": false, "draw": false};
        }else{
          GLOBAL_FOOT_PRINT[loopNode] = {"change": true, "draw": true};
          x = x + 1;
          loopNode = x + "-" + y;
          GLOBAL_FOOT_PRINT[loopNode] = {"change": true, "draw": false};
        }
      }
    }
  }
};

const drawNodeLine = ()=>{
  for(let y=0; y<heightNode; y++){
    for(let x=0; x<widthNode; x++){
      let node = x + "-" + y;
      let nodeInfo = GLOBAL_FOOT_PRINT[node];
      if(nodeInfo["change"] && nodeInfo["draw"]){
        stokeLine(x, y, 'w', 'r', '#ddd', '2');
      }
    }
  }
}

const stokeLine = (x, y, flag, dir, color, width)=>{
  let canvas = document.getElementById('ladder_canvas');
  let ctx = canvas.getContext('2d');
  let moveToStart = 0, moveToEnd = 0, lineToStart = 0, lineToEnd = 0;
  let eachWidth = 100;
  let eachHeight = 25;
  if(flag == "w"){
    if(dir == "r"){
      ctx.beginPath();
      moveToStart = x * eachWidth;
      moveToEnd = y * eachHeight;
      lineToStart = (x+1) * eachWidth;
      lineToEnd = y * eachHeight;
    }else{
      ctx.beginPath();
      moveToStart = x * eachWidth;
      moveToEnd = y * eachHeight;
      lineToStart = (x-1) * eachWidth;
      lineToEnd = y * eachHeight;
    }
  }else{
    ctx.beginPath();
    moveToStart = x * eachWidth;
    moveToEnd = y * eachHeight;
    lineToStart = x * eachWidth;
    lineToEnd = (y+1) * eachHeight;
  }
  ctx.moveTo(moveToStart + 3, moveToEnd + 2);
  ctx.lineTo(lineToStart + 3, lineToEnd + 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();
};

const userSetting = ()=>{
  let userList = LADDER[0];
  let html = '';
  for(let i=0; i<userList.length; i++){
    let color = "#" + (function lol(m, s, c){
      return s[m.floor(m.random() * s.length)] + (c && lol(m, s, c-1));
    })(Math,'0123456789ABCDEF', 4);
    let x = userList[i].split('-')[0]*1;
    let y = userList[i].split('-')[1]*1;
    let left = x * 100 - 30;
    html += '<div class="user-wrap" style="left:'+left+'">';
    if(i==0){
      html +=   '<input type="text" data-node="'+userList[i]+'" id="firstName">';
    }else{
      html +=   '<input type="text" data-node="'+userList[i]+'">';
    }
    html +=   '<button class="ladder-start" style="background-color:'+color+'" data-color="'+color+'" data-node="'+userList[i]+'"></button>';
    html += '</div>';
  }
  ladder.append(html);
};

const resultSetting = ()=>{
  let resultList = LADDER[heightNode - 1];
  let html = '';
  for(let i=0; i<resultList.length; i++){
    let x = resultList[i].split("-")[0] * 1;
    let y = resultList[i].split("-")[1] * 1+1;
    let node = x + "-" + y;
    let left = x * 100 - 30;
    html += '<div class="answer-wrap" style="left:' + left + '">';
    html +=   '<input type="text" data-node="' + node + '">';
    html +=   '<p id="' + node + '-user"></p>';
    html += '</div>';
  }
  ladder.append(html);
};

const startLineDrawing = (node, color)=>{
  let x = node.split('-')[0]*1;
  let y = node.split('-')[1]*1;
  let nodeInfo = GLOBAL_FOOT_PRINT[node];
  GLOBAL_CHECK_FOOT_PRINT[node] = true;
  let dir = 'r';

  if(y == heightNode){
    reSetCheckFootPrint();
    let target = $('input[data-node="' + node + '"]');
    target.css({
      'background-color': color
    });
    $('#'+node+'-user').text(userName);
    working = false;
    return false;
  }

  //사다리타기 로직
  if(nodeInfo["change"]){
    let leftNode = (x-1) + "-" + y;
    let rightNode = (x+1) + "-" + y;
    let downNode = x + "-" + (y+1);
    let leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
    let rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
    //사다리 중앙 부분
    if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){
      let leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
      let rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
      //left 우선
      if((leftNodeInfo["change"] && leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[leftNode]) 
        && rightNodeInfo["change"] && leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
        console.log(`3depth 중복일때 left 우선`);
        stokeLine(x, y, 'w', 'l', color, 3);
        setTimeout(()=>{
          return startLineDrawing(leftNode, color);
        }, delayTime);
      }
      //right 우선
      else if((leftNodeInfo["change"] && !leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[leftNode])
        && rightNodeInfo["change"] && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
        console.log(`3depth right 우선`);
        stokeLine(x, y, 'w', 'r', color, 3);
        setTimeout(()=>{
          return startLineDrawing(rightNode, color);
        }, delayTime);
      }
      //left 우선
      else if((leftNodeInfo["change"] && leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[leftNode])
        && !rightNodeInfo["change"]){
        console.log(`3depth left 우선`);
        stokeLine(x, y, 'w', 'l', color, 3);
        setTimeout(()=>{
          return startLineDrawing(leftNode, color);
        }, delayTime);
      }
      //right 우선
      else if(!leftNodeInfo["change"] && rightNodeInfo["change"] && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
        console.log(`3depth right 우선`);
        stokeLine(x, y, 'w', 'r', color, 3);
        setTimeout(()=>{
          return startLineDrawing(rightNode, color);
        }, delayTime);
      }
      //down 우선
      else{
        console.log(`3depth down 우선`);
        stokeLine(x, y, 'h', 'd', color, 3);
        setTimeout(()=>{
          return startLineDrawing(downNode, color);
        }, delayTime);
      }
    }
    //사다리 중앙 부분 아닐때(맨좌측, 맨우측)
    else{
      //맨좌측 기준
      if(!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){
        //right 우선
        if((rightNodeInfo["change"] && !rightNodeInfo["draw"]) && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
          console.log(`4depth right 우선`);
          stokeLine(x, y, 'w', 'r', color, 3);
          setTimeout(()=>{
            return startLineDrawing(rightNode, color);
          }, delayTime);
        }
        //down
        else{
          console.log(`4depth down`);
          stokeLine(x, y, 'h', 'd', color, 3);
          setTimeout(()=>{
            return startLineDrawing(downNode, color);
          }, delayTime);
        }
      }
      //맨우측 기준
      else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){
        //left 우선
        if((leftNodeInfo["change"] && leftNodeInfo["draw"]) && !GLOBAL_CHECK_FOOT_PRINT[leftNode]){
          console.log(`4depth left 우선`);
          stokeLine(x, y, 'w', 'l', color, 3);
          setTimeout(()=>{
            return startLineDrawing(leftNode, color);
          }, delayTime);
        }
        // down
        else{
          console.log(`4depth DOWN`);
          stokeLine(x, y, 'h', 'd', color, 3);
          setTimeout(()=>{
            return startLineDrawing(downNode, color);
          }, delayTime);
        }
      }
    }
  }
  //
  else{
    console.log(`1depth down`);
    let downNode = x + "-" + (y+1);
    stokeLine(x, y, 'h', 'd', color, 3);
    setTimeout(()=>{
      return startLineDrawing(downNode, color);
    }, delayTime);
  }
};


const checkResult = (node)=>{
  let x = node.split('-')[0]*1;
  let y = node.split('-')[1]*1;
  let nodeInfo = GLOBAL_FOOT_PRINT[node];
  GLOBAL_CHECK_FOOT_PRINT[node] = true;
  let dir = 'r';

  if(y == heightNode){
    reSetCheckFootPrint();
    return x;
  }

  //사다리타기 로직
  if(nodeInfo["change"]){
    let leftNode = (x-1) + "-" + y;
    let rightNode = (x+1) + "-" + y;
    let downNode = x + "-" + (y+1);
    let leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
    let rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
    //사다리 중앙 부분
    if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){
      let leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
      let rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
      //left 우선
      if((leftNodeInfo["change"] && leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[leftNode]) 
        && rightNodeInfo["change"] && leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
        return checkResult(leftNode);
      }
      //right 우선
      else if((leftNodeInfo["change"] && !leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[leftNode])
        && rightNodeInfo["change"] && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
        return checkResult(rightNode);
      }
      //left 우선
      else if((leftNodeInfo["change"] && leftNodeInfo["draw"] && !GLOBAL_CHECK_FOOT_PRINT[leftNode])
        && !rightNodeInfo["change"]){
        return checkResult(leftNode);
      }
      //right 우선
      else if(!leftNodeInfo["change"] && rightNodeInfo["change"] && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
        return checkResult(rightNode);
      }
      //down 우선
      else{
        console.log(`3depth down 우선`);
        return checkResult(downNode);
      }
    }
    //사다리 중앙 부분 아닐때(맨좌측, 맨우측)
    else{
      //맨좌측 기준
      if(!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){
        //right 우선
        if((rightNodeInfo["change"] && !rightNodeInfo["draw"]) && !GLOBAL_CHECK_FOOT_PRINT[rightNode]){
          return checkResult(rightNode);
        }
        //down
        else{
          return checkResult(downNode);
        }
      }
      //맨우측 기준
      else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){
        //left 우선
        if((leftNodeInfo["change"] && leftNodeInfo["draw"]) && !GLOBAL_CHECK_FOOT_PRINT[leftNode]){
          return checkResult(leftNode);
        }
        // down
        else{
          console.log(`4depth DOWN`);
          return checkResult(downNode);
        }
      }
    }
  }
  //
  else{
    let downNode = x + "-" + (y+1);
    return checkResult(downNode);
  }
};