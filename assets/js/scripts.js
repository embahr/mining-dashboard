
$(document).ready(function() {

  var suprnovaAPI = "acc00c3c08778b655fa2dea84a835fad2c4b80427e797fa48b2e1cf2d0fc7283&id=793582",
      suprnovaZEN = "https://zen.suprnova.cc/index.php?page=api&action=getuserstatus&api_key=",
      proxy = "https://cors-anywhere.herokuapp.com/",
      quad = "https://api.quadrigacx.com/v2/ticker?book=btc_cad",
      bit = "https://bittrex.com/api/v1.1/public/getticker?market=btc-zen",
      bitBal = "https://bittrex.com/api/v1.1/account/getbalances?apikey=",
      bitAPI = "70aa24fd187b433382e522dc91bd8782",
      what = "https://whattomine.com/coins.json",
      nhAPI = "https://api.nicehash.com/api?method=stats.provider&addr=",
      nhadd = "17jTMUZo4MQHuVKkyG67FHvqiS9x3hfiEk",
      blockInfo = "https://blockchain.info/q/addressbalance/",
      zenLast = 0,
      btcLast = 0,
      zenCad = 0,
      zenAvg = [],
      nhBal = 0,
      nhCad = 0;


  function pullData() {

    $.getJSON( proxy + quad,
      function(quadJSON) {
        //console.log("quadJSON" + " " + quadJSON);
        $(".btc_cad").html(quadJSON.last);
        btcLast = quadJSON.last;
      });

    $.getJSON( proxy + bit,
      function (bitJSON) {

        var zen = bitJSON.result;

      //  console.log("zen.Last" + " " + zen.Last);
        $(".zen-price").html(zen.Last);
        zenLast = zen.Last;

      });

      $.getJSON( proxy + blockInfo + nhadd,
        function (nhBals) {

          var nhBalances = (nhBals/100000000);

          console.log("Nh Balance" + " " + nhBals);
          $(".nh-deposit").html(nhBalances);
          $(".nh-deposit__cad").html("$" + (nhBalances * btcLast).toFixed(2));
      

        });

     $.getJSON( proxy + what,
        function (whatToMine) {

      //    console.log("what to mine" + " " + whatToMine.coins.Zencash);

      });

      $.getJSON( proxy + nhAPI + nhadd,
        function(nhJSON) {
          var nhStats = nhJSON.result.stats;
        //  console.log("nhStats 0 bal" + " " + nhStats[0].balance);



          nhBal = 0;

          //since NH JSON response returns an object for each algo, with separate balances, will need to iterate through the stats val,
          //grab the balance and add to the nhBal var.

           for (var i = 0; i < nhStats.length; i++) {
             //console.log("nh bal before" + " " + nhBal);

             nhBal += +nhStats[i].balance;
            console.log("nh stats" + " " + nhStats[i].algo + " " + nhStats[i].balance);
          //   console.log("nh bal after" + " " + nhBal);
        }

            $(".nh-bal").html(nhBal.toFixed(8));
        });

      //  console.log("zenLast" + " " + zenLast);
      zenCad = (btcLast * zenLast).toFixed(2);
      nhCad = (btcLast * nhBal).toFixed(2);

      $(".zen-cad").html("$" + zenCad);
      $(".nh-cad").html("$" + nhCad);

      $.getJSON( proxy + suprnovaZEN + suprnovaAPI,
       function( json ) {
         var miningJSON = json.getuserstatus.data,
             hashrate = miningJSON.hashrate,
             sharerate = miningJSON.sharerate,
             sharesValid = miningJSON.shares.valid,
             sharesInvalid = miningJSON.shares.invalid;

               $(".zen-hash").html(hashrate.toFixed(2));
               $(".zen-shares").html('<span class="zen-shares__valid">' + Math.floor((sharesValid*100)/100) + '</span>' + ' | ' + '<span class="zen-shares__invalid">' + sharesInvalid + '</span>');
               $(".zen-sharerate").html(sharerate);

        // console.log(json);
        // console.log(json.getuserstatus.data.hashrate);
      });
  }

  setInterval(function() {
    pullData();
  }, 11000);

});
