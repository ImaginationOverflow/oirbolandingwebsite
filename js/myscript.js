//*----------------------------------------------------*/
/*  contact form
------------------------------------------------------*/
function validateMath() {
    const input = $('#formid #math');
    const placeholder = input.attr('placeholder');  // e.g. "2 + 3"
    const value = parseInt(input.val(), 10);        // user answer

    // Extract numbers from placeholder
    const parts = placeholder.split('+').map(x => parseInt(x.trim(), 10));
    const correctSum = parts[0] + parts[1];

    if (value === correctSum) {
        return true;   // valid
    } else {
        return false;  // invalid
    }
}
function handleForm() {

	return;

	var contactName = $('#formid #contactName').val();
  var contactEmail = $('#formid #contactEmail').val();
  var contactSubject = $('#formid #contactSubject').val();
  var contactMessage = $('#formid #contactMessage').val();
  var contactMath = $('#formid #math').val();

  contactMessage = contactMessage.replace("\n", "</br>");



$('#message-warning').fadeIn();
$('#message-warning').hide();


	if(!validateMath())
	{
	  printContactError("Math question is wrong.");
	  return false;
	}

  if(!contactName || !contactEmail || !contactMessage || !contactSubject || !contactMath )
  {
	  printContactError("All the fields are mandatory.");
	  return false;
  }
  
  
$('#contactformbut').hide();
$('#contactFormLoad').hide();
$('#contactFormLoad').fadeIn();
  
  
  var params = {
		name: contactName, 
		email: contactEmail,
		message: contactMessage,
		subject: "[Oirbo] "+contactSubject
	};
  emailjs.send("gmail","template_wwaqqnk",params)
	.then(function(response) 
	{
		$('#message-warning').hide();
		$('#formid').fadeOut();
		$('#message-success').fadeIn();   
	}, 
	function(err) 
	{
		printContactError("Something went wrong\n, if the issue persist, try contact us on the social networks");
	});



	return false;
};

function printContactError(error)
{
	$('#message-warning').html(error);
	$('#message-warning').fadeIn();
}

//*----------------------------------------------------*/
/*  News Downloader
------------------------------------------------------*/
/*
<div class="card">
	<a href="www.google.com">
		<img src="https://c10.patreonusercontent.com/3/eyJoIjo1MTgsInciOjkyMH0%3D/patreon-media/p/post/26282769/1f3387bb272f43fa99429cec743a5028/1.png?token-time=1557273600&amp;token-hash=vvaMmMUzVMINjb0UpQ78kmVkhACmW7d8Ztgn2AJ-7mI%3D"
class="card-img-top" alt="..." />
		<div class="card-body">
			<h5 class="card-title align-items-center">Oirbo DevLog #16 - Backgrounds, SFX and Patron Alpha bla bla
	bla Release!</h5>
		</div>
		<div class="card-footer">
			<p class="card-text">
				<small class="text-muted">Last updated 3 mins ago</small>
			</p>
		</div>
	</a>
</div>

*/
var id = 0;
function AddNews(link, image, title, date)
{
	var container = $("#newsContainer");
	
	date = moment(date,"YYYY-MM-DDTh:mm:ss").fromNow();
	var str = `
	<div class="card" id="${link}">
		<img src="${image}" class="card-img-top" alt="..." />
		<div class="card-body">
			<h5 class="card-title align-items-center">${title}</h5>
		</div>
		<div class="card-footer">
				<small class="text-muted">${date}</small>
				
		</div>
</div>
	`;
	id++;
	var node = $($.parseHTML(str));
	
	
	container.append(str);
	
	
}

function AddNewsFromPatreon(data)
{
	AddNews
	(
		data.attributes.url,
		data.attributes.image==null?"imgs/emptyNews.png" : data.attributes.image.thumb_url,
		data.attributes.title,
		data.attributes.published_at
	)
}

var testimg = "https://c10.patreonusercontent.com/3/eyJoIjo1MTgsInciOjkyMH0%3D/patreon-media/p/post/26282769/1f3387bb272f43fa99429cec743a5028/1.png?token-time=1557273600&amp;token-hash=vvaMmMUzVMINjb0UpQ78kmVkhACmW7d8Ztgn2AJ-7mI%3D";


var reqUrl = "http://www.patreon.com/api/posts?fields[post]=image%2Cpost_file%2Cpublished_at%2Cpatron_count%2Cpatreon_url%2Cpost_type%2Cpledge_url%2Cthumbnail_url%2Cteaser_text%2Ctitle%2Curl&fields[user]=image_url%2Cfull_name%2Curl&fields[campaign]=avatar_photo_url%2Cearnings_visibility%2Cis_nsfw%2Cis_monthly%2Cname%2Curl&fields[access_rule]=access_rule_type%2Camount_cents&sort=-published_at&filter[campaign_id]=1283507&filter[is_draft]=false&filter[tag]=Oirbo&filter[contains_exclusive_posts]=true&json-api-use-default-includes=false&json-api-version=1.0"

$(document).ready(function() {
/*	
  $.ajaxPrefilter( function (options) {
	  return;
  if (options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    //options.url = "http://cors.corsproxy.io/url=" + options.url;
  }
});
*/

var url = 'https://api.allorigins.win/get?url='+encodeURIComponent(reqUrl);

$.get({
    url: url,
    success: function (response) 
	{
		AddNewsFromPatreon(response.data[0]);
		AddNewsFromPatreon(response.data[1]);
		AddNewsFromPatreon(response.data[2]);
		
		
		var elems = $("#newsContainer").on('click', ".card", function(data,__){
			var url = data.currentTarget.id;
			window.open( url);
		});	
	},
	beforeSend: function(xhr)
	{
		xhr.setRequestHeader('X-Requested-With', 'oirbo.com');
	},
	}
	);

});
