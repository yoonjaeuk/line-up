var svg = d3.select('#renderer').append('svg');
var title = d3.select('#title_renderer').append('svg');
//console.log(svg);

var d;

var L_weight_d = 10;
var L_weight_s = 10;
var L_weight_n = 10;
var L_weight_m = 10;
var L_weight_b = 10;
var L_weight_l = 10;

var R_weight_d = 10;
var R_weight_s = 10;
var R_weight_n = 10;
var R_weight_m = 10;
var R_weight_b = 10;
var R_weight_l = 10;

var group1 = svg.append('g');
var group2 = svg.append('g');
var groupLine = svg.append('g');

var rankOrigin = [];
var rankWeighted = [];

var color_r = '#cd2e6e'; //스파클 라인 색
var color_b = '#2e32cd';

function L_listen(c0, c1, c2, c3, c4) {
  group1.remove();
  group1 = svg.append('g');
  group1.attr('transform', 'translate(0,0)');
  L_weight_d = c0;
  L_weight_s = c1 - c0;
  L_weight_n = c2 - c1;
  L_weight_m = c3 - c2;
  L_weight_b = c4 - c3;
  L_weight_l = 60 - c4;

  rankSort(
    L_weight_d,
    L_weight_s,
    L_weight_n,
    L_weight_m,
    L_weight_b,
    L_weight_l,
  );
  rankOrigin = makeRank();
  update(
    d,
    group1,
    L_weight_d,
    L_weight_s,
    L_weight_n,
    L_weight_m,
    L_weight_b,
    L_weight_l,
  );
  drawCompareLine();
}

function R_listen(c0, c1, c2, c3, c4) {
  group2.remove();
  group2 = svg.append('g');
  group2.attr('transform', 'translate(750,0)');

  R_weight_d = c0;
  R_weight_s = c1 - c0;
  R_weight_n = c2 - c1;
  R_weight_m = c3 - c2;
  R_weight_b = c4 - c3;
  R_weight_l = 60 - c4;

  rankSort(
    R_weight_d,
    R_weight_s,
    R_weight_n,
    R_weight_m,
    R_weight_b,
    R_weight_l,
  );
  rankWeighted = makeRank();
  update(
    d,
    group2,
    R_weight_d,
    R_weight_s,
    R_weight_n,
    R_weight_m,
    R_weight_b,
    R_weight_l,
  );
  drawCompareLine();
}

//랭킹 array로 저장
function makeRank() {
  var rank = {};
  for (var i = 0; i < d.length; i++) {
    rank[d[i].institution] = i;
    // console.log(d[i]["download" + week] * weight_d / max_downloads[week-1] +"/"+ d[i]["streaming" + week] * weight_s / max_streamings[week-1] +"/"+ d[i]["social" + week] * weight_n / max_socials[week-1]+"/"+d[i].title);
  }
  return rank;
}

//두 랭킹 간 순위 변화, 선으로 그리기
function drawCompareLine() {
  var keys = Object.keys(rankOrigin);
  groupLine.remove();
  groupLine = svg.append('g');
  groupLine.attr('transform', 'translate(630,10)');
  groupLine
    .append('rect')
    .attr('x', 45)
    .attr('y', -10)
    .attr('width', 60)
    .attr('height', 27 * keys.length)
    .attr('fill', 'white');
  for (var i = 0; i < keys.length; i++) {
    // if( Math.abs(rankOrigin[keys[i]] - rankWeighted[keys[i]]) > 10){
    //     var num = rankOrigin[keys[i]] * 1 - rankWeighted[keys[i]] * 1;
    //     groupLine.append('text').attr('x', 6).attr('y',rankOrigin[keys[i]] * 27 + 5).text(num +' ')
    //       .attr('fill', rankOrigin[keys[i]] > rankWeighted[keys[i]] ? '#f00' : '#00f');
    // }
    var num = rankOrigin[keys[i]] * 1 - rankWeighted[keys[i]] * 1;

    if (rankOrigin[keys[i]] === rankWeighted[keys[i]]) {
      groupLine
        .append('text')
        .attr('x', 25)
        .attr('y', rankOrigin[keys[i]] * 27 + 5)
        .text(num + ' ')
        .attr('fill', '#3f4040')
        .style('font', '14px gothic');

      if (Math.abs(rankOrigin[keys[i]] - rankWeighted[keys[i]]) < 10) {
        groupLine
          .append('line')
          .attr('x1', 50)
          .attr('x2', 100)
          .attr('y1', rankOrigin[keys[i]] * 27)
          .attr('y2', rankWeighted[keys[i]] * 27)
          .attr('stroke', '#3f4040');
      }
    } else {
      groupLine
        .append('text')
        .attr('x', 25)
        .attr('y', rankOrigin[keys[i]] * 27 + 5)
        .text(num + ' ')
        .attr(
          'fill',
          rankOrigin[keys[i]] > rankWeighted[keys[i]] ? '#f00' : '#00f',
        )
        .style('font', '14px gothic');

      if (Math.abs(rankOrigin[keys[i]] - rankWeighted[keys[i]]) < 10) {
        groupLine
          .append('line')
          .attr('x1', 50)
          .attr('x2', 100)
          .attr('y1', rankOrigin[keys[i]] * 27)
          .attr('y2', rankWeighted[keys[i]] * 27)
          .attr(
            'stroke',
            rankOrigin[keys[i]] > rankWeighted[keys[i]] ? '#f00' : '#00f',
          );
      }
    }
  }
}

//ranking sorting
function rankSort(w_d, w_s, w_n, w_m, w_b, w_l) {
  var ret = _.sortBy(d, function (each) {
    var col =
      each['rep score'] * w_d +
      each['fsr score'] * w_s +
      each['cpf score'] * w_n +
      each['int score'] * w_m +
      each['irn score'] * w_b +
      each['ger score'] * w_l;
    return -col;
  });
  d = ret;
}

d3.json('visual/qs데이터.json', function (data) {
  d = data;
  rankSort(10, 10, 10, 10, 10, 10);
  rankOrigin = makeRank();
  rankWeighted = makeRank();

  drawCompareLine();

  group1.attr('transform', 'translate(0, 0)');
  group2.attr('transform', 'translate(750, 0)');
  update(
    d,
    group1,
    L_weight_d,
    L_weight_s,
    L_weight_n,
    L_weight_m,
    L_weight_b,
    L_weight_l,
  );
  update(
    d,
    group2,
    R_weight_d,
    R_weight_s,
    R_weight_n,
    R_weight_m,
    R_weight_b,
    R_weight_l,
  );
});
//제목
title
  .append('text')
  .attr('y', 20)
  .attr('x', 4)
  .text('R')
  .style('font', '15px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 180)
  .text('institution')
  .style('font', '17px notosanskr');
title
  .append('text')
  .attr('y', 20)
  .attr('x', 754)
  .text('R')
  .style('font', '15px notosanskr');

title
  .append('text')
  .attr('y', 20)
  .attr('x', 930)
  .text('institution')
  .style('font', '17px notosanskr');

function update(
  d,
  parent,
  weight_d,
  weight_s,
  weight_n,
  weight_m,
  weight_b,
  weight_l,
) {
  //console.log("update", d, parent);
  var height = 27;
  // adjust the value

  _.forEach(d, function (d, i) {
    if (i % 2 == 0) {
      // 리스트 줄무늬 그리기
      parent
        .append('rect')
        .attr('y', i * height)
        .attr('height', height)
        .attr('width', 750)
        .attr('x', 0)
        .attr('fill', '#f5f5f7');
    }

    // ranking
    parent
      .append('text')
      .attr('y', 15 + i * height)
      .attr('font-size', 13)
      .attr('height', height - 2)
      .attr('x', 1)
      .text(i + 1 + '.');

    // cluster
    //var deliver d;

    parent
      .append('text')
      .attr('y', 15 + i * height)
      .attr('font-size', 13)
      .attr('height', height - 2)
      .attr('x', 25)
      .text(i + 1 + '.');

    /*
      // 누르면 데이터 가져옴
      .on('click', function () {
        // console.log(d["download"+week])
        drawSideGraph(week, deliver);

        draw_SideSparkLine(
          deliver,
          L_weight_d,
          L_weight_s,
          L_weight_n,
          R_weight_d,
          R_weight_s,
          R_weight_n,
        );

        // var side_L = d3.select('#side_sparkLine').append('svg');
        // var side_R = d3.select('#side_sparkLine').append('svg');
        //
        // if(parent==group1){
        //     side_L.remove();
        //     side_L=d3.select('#side_sparkLine').append('svg');
        //     // groupSparkLine1.attr('transform', 'translate(280,80)');
        //     draw_SideSparkLine(side_L, deliver, weight_d, weight_s, weight_n, color_r);
        // }
        // else if(parent==group2){
        //     side_R.remove();
        //     side_R=d3.select('#side_sparkLine').append('svg');
        //     draw_SideSparkLine(side_R, deliver, weight_d, weight_s, weight_n, color_r);
        // }

        return;
      });*/

    //institution
    if (d.institution !== undefined) {
      parent
        .append('text')
        .attr('y', 15 + i * height)
        .attr('font-size', 13)
        .attr('height', height - 2)
        .attr('x', 150)
        .text(
          d.institution.length > 10
            ? d.institution.slice(0, 10) + '...'
            : d.institution,
        );

      /* 누르면 데이터 가져옴
        .on('click', function () {
          // console.log(d["download"+week])
          drawSideGraph(week, deliver);

          var side_L = d3.select('#side_sparkLine').append('svg');
          var side_R = d3.select('#side_sparkLine').append('svg');
          
        });*/
    }

    // rep score
    parent
      .append('rect')
      .attr('y', i * height)
      .attr('x', 280)
      .attr('height', height - 2)
      .attr('fill', '#000000')
      // max_downloads[0] -> 이거 따로 max_download로 바꿔야 함.
      .attr('width', (d['rep score'] * weight_d) / 20);

    // fsr score
    parent
      .append('rect')
      .attr('y', i * height)
      .attr('x', 280 + (d['rep score'] * weight_d) / 20)
      .attr('height', height - 2)
      .attr('fill', '#708090')
      .attr('width', (d['fsr score'] * weight_s) / 20);

    // cpf score
    parent
      .append('rect')
      .attr('y', i * height)
      .attr(
        'x',
        280 +
          (d['rep score'] * weight_d) / 20 +
          (d['fsr score'] * weight_s) / 20,
      )
      .attr('height', height - 2)
      .attr('fill', '#696969')
      .attr('width', (d['cpf score'] * weight_n) / 20);

    //int score

    parent
      .append('rect')
      .attr('y', i * height)
      .attr(
        'x',
        280 +
          (d['rep score'] * weight_d) / 20 +
          (d['fsr score'] * weight_s) / 20 +
          (d['cpf score'] * weight_n) / 20,
      )
      .attr('height', height - 2)
      .attr('fill', '#A9A9A9')
      .attr('width', (d['int score'] * weight_m) / 20);

    //irn score
    parent
      .append('rect')
      .attr('y', i * height)
      .attr(
        'x',
        280 +
          (d['rep score'] * weight_d) / 20 +
          (d['fsr score'] * weight_s) / 20 +
          (d['cpf score'] * weight_n) / 20 +
          (d['int score'] * weight_m) / 20,
      )
      .attr('height', height - 2)
      .attr('fill', '#D3D3D3')
      .attr('width', (d['irn score'] * weight_b) / 20);

    //ger score
    parent
      .append('rect')
      .attr('y', i * height)
      .attr(
        'x',
        280 +
          (d['rep score'] * weight_d) / 20 +
          (d['fsr score'] * weight_s) / 20 +
          (d['cpf score'] * weight_n) / 20 +
          (d['int score'] * weight_m) / 20 +
          (d['irn score'] * weight_b) / 20,
      )

      .attr('height', height - 2)
      .attr('fill', '#DCDCDC')
      .attr('width', (d['ger score'] * weight_l) / 20);
  });
}
