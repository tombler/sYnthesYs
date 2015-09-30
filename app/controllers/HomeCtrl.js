app.controller("HomeCtrl", ["$scope", "$location" ,function ($scope, $location) {

    // ******************** BUBBLES *******************************//
    // Taken from http://fiddle.jshell.net/DYN6U/
    (function() {
    var paper, circs, i, nowX, nowY, timer, props = {}, toggler = 0, elie, dx, dy, rad, cur, opa;
    // Returns a random integer between min and max  
    // Using Math.round() will give you a non-uniform distribution!  
    function ran(min, max)  
    {  
        return Math.floor(Math.random() * (max - min + 1)) + min;  
    } 
    
    function moveIt()
    {
        for(i = 0; i < circs.length; ++i)
        {            
              // Reset when time is at zero
            if (! circs[i].time) 
            {
                circs[i].time  = ran(30, 100);
                circs[i].deg   = ran(-179, 180);
                circs[i].vel   = ran(1, 5);  
                circs[i].curve = ran(0, 1);
                circs[i].fade  = ran(0, 1);
                circs[i].grow  = ran(-2, 2); 
            }                
                // Get position
            nowX = circs[i].attr("cx");
            nowY = circs[i].attr("cy");   
               // Calc movement
            dx = circs[i].vel * Math.cos(circs[i].deg * Math.PI/180);
            dy = circs[i].vel * Math.sin(circs[i].deg * Math.PI/180);
                // Calc new position
            nowX += dx;
            nowY += dy;
                // Calc wrap around
            if (nowX < 0) nowX = 1200 + nowX;
            else          nowX = nowX % 1200;            
            if (nowY < 0) nowY = 1200 + nowY;
            else          nowY = nowY % 1200;
            
                // Render moved particle
            circs[i].attr({cx: nowX, cy: nowY});
            
                // Calc growth
            rad = circs[i].attr("r");
            if (circs[i].grow > 0) circs[i].attr("r", Math.min(30, rad + 0.1));
            else                   circs[i].attr("r", Math.max(10,  rad - 0.1));
            
                // Calc curve
            if (circs[i].curve > 0) circs[i].deg = circs[i].deg + 2;
            else                    circs[i].deg = circs[i].deg - 2;
            
                // Calc opacity
            opa = circs[i].attr("fill-opacity");
            if (circs[i].fade > 0) {
                circs[i].attr("fill-opacity", Math.max(0.3, opa - 0.01));
                circs[i].attr("stroke-opacity", Math.max(0.3, opa - 0.01)); }
            else {
                circs[i].attr("fill-opacity", Math.min(1, opa + 0.01));
                circs[i].attr("stroke-opacity", Math.min(1, opa + 0.01)); }

            // Progress timer for particle
            circs[i].time = circs[i].time - 1;
            
                // Calc damping
            if (circs[i].vel < 1) circs[i].time = 0;
            else circs[i].vel = circs[i].vel -0.05;              
       
        } 
        timer = setTimeout(moveIt, 60);
    }

        paper = Raphael("canvas", 1275, 800);
        // console.log("paper", paper);
        circs = paper.set();
        for (i = 0; i < 30; ++i)
        {
            opa = ran(3,10)/10;
            circs.push(paper.circle(ran(0,800), ran(0,800), ran(10,30)).attr({"fill-opacity": opa,
                                                                           "stroke-opacity": opa}));
        }
        circs.attr({fill: "#00DDAA", stroke: "#00DDAA"});
        moveIt();
    }()); //End of bubbles function


    $scope.goToKeyboard = function () {
        $location.url('/keyboard');
    };




}]);