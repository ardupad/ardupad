/**
 * Copyright 2011 Pierros Papadeas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var serial = (function()
{
  var self = {
    show: function () 
    {      
      $("#serialicon").hide("slide", {
        direction: "down"
      }, 500, function ()
      {
        $("#serialbox").show("slide", {
          direction: "down"
        }, 750, self.scrollDown);
        $("#serialbox").resizable(
        {
          handles: 'ne', minWidth: 145,
          start: function (event, ui)
          {
            $("#focusprotector").show();
          },
          stop: function (event, ui)
          {
            $("#focusprotector").hide();
            
            $("#serialbox").css({right: "20px", bottom: "0px", left: "", top: ""});
            
            self.scrollDown();
          }
        });
      });
    },
    hide: function () 
    {
      $("#serialbox").hide("slide", { direction: "down" }, 750, function()
      {
        $("#serialicon").show("slide", { direction: "down" }, 500);
      });
    },
    scrollDown: function()
    {    
      if($('#serialbox').css("display") != "none")
        $('#serialtext').animate({scrollTop: $('#serialtext')[0].scrollHeight}, "slow");
    }, 
    send: function()
    {
      var text = $("#serialinput").val();
      //function to send a message to our addon
      $("#serialinput").val("");
    },
    addMessage: function(msg, increment)
    {    
      //correct the time
      msg.time += pad.clientTimeOffset; 
      
      //create the time string
      var minutes = "" + new Date(msg.time).getMinutes();
      var hours = "" + new Date(msg.time).getHours();
      if(minutes.length == 1)
        minutes = "0" + minutes ;
      if(hours.length == 1)
        hours = "0" + hours ;
      var timeStr = hours + ":" + minutes;
        
      //create the authorclass
      var authorClass = "author-" + msg.userId.replace(/[^a-y0-9]/g, function(c)
      {
        if (c == ".") return "-";
        return 'z' + c.charCodeAt(0) + 'z';
      });

      var text = padutils.escapeHtmlWithClickableLinks(padutils.escapeHtml(msg.text), "_blank");
      var authorName = msg.userName == null ? "unnamed" : padutils.escapeHtml(msg.userName); 
      
      var html = "<p class='" + authorClass + "'><b>" + authorName + ":</b><span class='time'>" + timeStr + "</span> " + text + "</p>";
      $("#serialtext").append(html);
      
      self.scrollDown();

    },
    init: function()
    {
      $("#serialinput").keypress(function(evt)
      {
        //Fire this event in addon when key is pressed
      });
    }
  }

  return self;
}());
